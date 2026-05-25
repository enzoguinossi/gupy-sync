import { parseLinkedinEducationCSV } from "@/parsers/linkedin/education/linkedin.education.parser.js";
import { UserInput } from "@/infra/cli/userInput.types.js";
import { buildEducationPayload } from "@/services/gupy/payloads/gupy.payload.js";
import { createGupyClient } from "@/infra/http/gupyClient.factory.js";
import { normalizeCourseText } from "@/shared/util/normalizeCourseText.js";
import { GupyEducationInput } from "@/types/gupy/education/input/gupy.education.input.types.js";
import {
	GupyEducationTypes,
	GupyUnderGraduationTypes,
} from "@/types/gupy/education/enum/gupy.education.enum.js";
import { EducationEntity } from "@/domain/entities/education.entity.js";
import {
	mapEducationLevelToGupy,
	mapToGupyEducationInput,
} from "@/services/gupy/education/gupy.education.mapper.js";

/**
 * Checks if the provided formation type corresponds to an under-graduation level
 * (e.g., High School, Elementary School).
 *
 * @param formationType - The formation type to check.
 * @returns True if the type is an under-graduation type, false otherwise.
 */
function isUnderGraduationType(
	formationType: GupyEducationTypes | GupyUnderGraduationTypes | "unknown",
): formationType is GupyUnderGraduationTypes {
	return Object.values(GupyUnderGraduationTypes).includes(
		formationType as GupyUnderGraduationTypes,
	);
}

/**
 * Determines whether the current under-graduation degree should be updated with a new type.
 * Prioritizes "Completed High School" over other types.
 *
 * @param current - The current under-graduation degree (if any).
 * @param newType - The new under-graduation degree candidate.
 * @returns True if the degree should be updated, false otherwise.
 */
function shouldUpdateUnderGraduation(
	current: GupyUnderGraduationTypes | undefined,
	newType: GupyUnderGraduationTypes,
): boolean {
	if (newType === GupyUnderGraduationTypes.completedHighSchool) {
		return true;
	}
	return !current;
}

/**
 * Resolves the Gupy education type for a given education entity.
 * If the type cannot be automatically mapped, it prompts the user to select one.
 *
 * @param entity - The education entity from the domain layer.
 * @param userInput - The user input interface for CLI interactions.
 * @returns A promise that resolves to the Gupy education type or under-graduation type.
 */
async function resolveFormationType(
	entity: EducationEntity,
	userInput: UserInput,
): Promise<GupyEducationTypes | GupyUnderGraduationTypes> {
	const mappedType = mapEducationLevelToGupy(entity.level);

	if (mappedType === "unknown") {
		return await userInput.selectFormationType(entity.institution);
	}
	return mappedType;
}

/**
 * @param entity - The education entity from the domain layer.
 * @param userInput - The user input interface for CLI interactions.
 * @returns A promise that resolves to the normalized course name.
 */
async function resolveCourseName(entity: EducationEntity, userInput: UserInput): Promise<string> {
	// Always ask for the course name, as LinkedIn's "Degree Name" is often just the degree type (e.g., "Bachelor's")
	// and not the actual course name (e.g., "Computer Science").
	const courseName = await userInput.askCourseName(entity.institution);
	return normalizeCourseText(courseName);
}

/**
 * Processes a list of education entities to prepare them for Gupy synchronization.
 * It resolves types and course names, separates under-graduation degrees, and
 * constructs the final list of Gupy education inputs.
 *
 * @param entities - The list of education entities to process.
 * @param userInput - The user input interface for CLI interactions.
 * @returns A promise that resolves to an object containing the final list of formations
 *          and the determined under-graduation degree.
 */
async function processFormations(
	entities: EducationEntity[],
	userInput: UserInput,
): Promise<{
	finalFormations: GupyEducationInput[];
	finalUnderGraduationDegree?: GupyUnderGraduationTypes;
}> {
	let finalUnderGraduationDegree: GupyUnderGraduationTypes | undefined;
	const finalFormations: GupyEducationInput[] = [];

	for (const entity of entities) {
		const formationType = await resolveFormationType(entity, userInput);

		if (isUnderGraduationType(formationType)) {
			if (shouldUpdateUnderGraduation(finalUnderGraduationDegree, formationType)) {
				finalUnderGraduationDegree = formationType;
			}
			continue;
		}

		// If we reached here, it is a higher education formation (GupyEducationTypes)
		const courseName = await resolveCourseName(entity, userInput);

		// Update the entity with the normalized course name for the mapper to use
		const updatedEntity = { ...entity, course: courseName };

		finalFormations.push(
			mapToGupyEducationInput(updatedEntity, formationType as GupyEducationTypes),
		);
	}

	// If there is any higher education formation, assume at least completed high school
	if (finalFormations.length > 0) {
		finalUnderGraduationDegree = GupyUnderGraduationTypes.completedHighSchool;
	}

	return { finalFormations, finalUnderGraduationDegree };
}

/**
 * Displays a success message to the console after a successful synchronization.
 * Includes recommendations for manual checks and project support links.
 */
function displaySuccessMessage(): void {
	console.log(`
🎉 Sucesso!

A formação acadêmica foi sincronizada com a Gupy com base nos dados do LinkedIn.

ℹ️ Recomendação importante:
Após a sincronização, é altamente recomendável acessar a Gupy e
ajustar manualmente o nome do curso e da instituição para o padrão
utilizado pela plataforma. Isso melhora a legibilidade e aumenta a
compatibilidade com as ferramentas de ATS da Gupy.

Exemplo:
- Curso: "Análise e Desenvolvimento de Sistemas"
- Instituição: "Centro Universitário XYZ"

💙 Curtiu o projeto?
⭐ Favorite no GitHub – isso ajuda muito!
👉 https://github.com/enzoguinossi

🔗 Me siga no LinkedIn:
👉 https://www.linkedin.com/in/enzoguinossi/

— Enzo
`);
}

/**
 * Displays the result of a dry run to the console.
 * Shows the payload that would have been sent to Gupy without actually sending it.
 *
 * @param payload - The payload object constructed for the Gupy API.
 */
function displayDryRunResult(payload: any): void {
	console.log("🔎 DRY RUN – nenhum dado foi enviado");
	console.log(JSON.stringify(payload, null, 2));
}

/**
 * Main function to synchronize LinkedIn education data to Gupy.
 * It parses the CSV file, processes the data into Gupy-compatible formats,
 * and either performs a dry run or sends the data to the Gupy API.
 *
 * @param csvPath - The file path to the LinkedIn education CSV.
 * @param dryRun - If true, performs a dry run without sending data to the API.
 * @param userInput - The user input interface for CLI interactions.
 * @returns A promise that resolves when the operation is complete.
 */
export async function syncLinkedinEducationToGupy(
	csvPath: string,
	dryRun: boolean,
	userInput: UserInput,
) {
	const educationEntities = parseLinkedinEducationCSV(csvPath);

	const { finalFormations, finalUnderGraduationDegree } = await processFormations(
		educationEntities,
		userInput,
	);

	const payload = buildEducationPayload({
		formations: finalFormations,
		underGraduationDegree: finalUnderGraduationDegree,
	});

	if (dryRun) {
		displayDryRunResult(payload);
		return;
	}

	const gupy = await createGupyClient();
	await gupy.replaceAcademicFormation(payload);

	displaySuccessMessage();
}
