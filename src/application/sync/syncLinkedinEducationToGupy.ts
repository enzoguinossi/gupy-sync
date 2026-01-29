import { parseLinkedinEducationCSV } from "../../parsers/linkedin/education/linkedin.education.parser.js";
import { UserInput } from "../../infra/cli/userInput.types.js";
import { buildEducationPayload } from "../../services/gupy/payloads/gupy.payload.js";
import { createGupyClient } from "../../infra/http/gupyClient.factory.js";
import { normalizeCourseText } from "../../shared/util/normalizeCourseText.js";
import { GupyEducationInput } from "../../services/gupy/education/gupy.education.input.types.js";
import { LinkedinEducationDomain } from "../../parsers/linkedin/education/linkedin.education.types.js";
import { CliError } from "../../errors/index.js";
import {
	GupyEducationTypes,
	GupyUnderGraduationTypes,
} from "../../parsers/gupy/education/gupy.education.types.js";

function isUnderGraduationType(
	formationType: GupyEducationTypes | GupyUnderGraduationTypes | "unknown",
): formationType is GupyUnderGraduationTypes {
	return Object.values(GupyUnderGraduationTypes).includes(
		formationType as GupyUnderGraduationTypes,
	);
}

function shouldUpdateUnderGraduation(
	current: GupyUnderGraduationTypes | undefined,
	newType: GupyUnderGraduationTypes,
): boolean {
	if (newType === GupyUnderGraduationTypes.completedHighSchool) {
		return true;
	}
	return !current;
}

async function resolveFormationType(
	formation: LinkedinEducationDomain,
	userInput: UserInput,
): Promise<GupyEducationTypes | GupyUnderGraduationTypes> {
	if (formation.formation === "unknown") {
		return await userInput.selectFormationType(formation.institution);
	}
	return formation.formation;
}

async function resolveCourseName(
	formation: LinkedinEducationDomain,
	userInput: UserInput,
): Promise<string> {
	if (!formation.course) {
		const courseName = await userInput.askCourseName(formation.institution);
		return normalizeCourseText(courseName);
	}
	return normalizeCourseText(formation.course);
}

async function processFormations(
	formations: LinkedinEducationDomain[],
	userInput: UserInput,
	initialUnderGraduation?: GupyUnderGraduationTypes,
): Promise<{
	finalFormations: LinkedinEducationDomain[];
	finalUnderGraduationDegree?: GupyUnderGraduationTypes;
}> {
	let finalUnderGraduationDegree = initialUnderGraduation;
	const finalFormations: LinkedinEducationDomain[] = [];

	for (const formation of formations) {
		const formationType = await resolveFormationType(formation, userInput);

		if (isUnderGraduationType(formationType)) {
			if (shouldUpdateUnderGraduation(finalUnderGraduationDegree, formationType)) {
				finalUnderGraduationDegree = formationType;
			}
			continue;
		}

		formation.formation = formationType as GupyEducationTypes;
		formation.course = await resolveCourseName(formation, userInput);

		finalFormations.push(formation);
	}
	if (finalFormations.length > 0) {
		finalUnderGraduationDegree = GupyUnderGraduationTypes.completedHighSchool;
	}
	return { finalFormations, finalUnderGraduationDegree };
}

function mapToGupyEducationInput(formations: LinkedinEducationDomain[]): GupyEducationInput[] {
	return formations.map((f) => {
		if (f.formation === "unknown") {
			throw new CliError(
				`O curso da instituição "${f.institution}" ainda está "unknown".\nSelecione o tipo de formação antes de enviar.`,
			);
		}

		return {
			formation: f.formation as GupyEducationTypes,
			course: f.course!,
			conclusionStatus: f.conclusionStatus,
			institution: f.institution,
			startDateMonth: f.startDateMonth,
			startDateYear: String(f.startDateYear),
			endDateMonth: f.endDateMonth,
			endDateYear: String(f.endDateYear),
		};
	});
}

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

function displayDryRunResult(payload: any): void {
	console.log("🔎 DRY RUN – nenhum dado foi enviado");
	console.log(JSON.stringify(payload, null, 2));
}

export async function syncLinkedinEducationToGupy(
	csvPath: string,
	dryRun: boolean,
	userInput: UserInput,
) {
	const { formations, underGraduationDegree: initialUnderGraduation } =
		parseLinkedinEducationCSV(csvPath);

	const { finalFormations, finalUnderGraduationDegree } = await processFormations(
		formations,
		userInput,
		initialUnderGraduation,
	);

	const payload = buildEducationPayload({
		formations: mapToGupyEducationInput(finalFormations),
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
