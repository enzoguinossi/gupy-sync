import { Platform } from "@/platform/contracts/Platform.js";
import { EducationEntity } from "@/domain/entities/education.entity.js";
import { EducationLevel } from "@/domain/enums/education-level.enum.js";
import { parseLinkedinEducationCSV } from "@/parsers/linkedin/education/linkedin.education.parser.js";
import { UserInput } from "@/infra/cli/userInput.types.js";
import { normalizeCourseText } from "@/shared/util/normalizeCourseText.js";
import { diffByKey } from "@/domain/services/diff.service.js";

async function resolveFormationType(
	entity: EducationEntity,
	userInput: UserInput,
): Promise<EducationLevel> {
	if (entity.level === EducationLevel.Unknown) {
		return await userInput.selectFormationType(entity.institution);
	}
	return entity.level;
}

async function resolveCourseName(entity: EducationEntity, userInput: UserInput): Promise<string> {
	const courseName = await userInput.askCourseName(entity.institution);
	return normalizeCourseText(courseName);
}

function isUnderGraduationLevel(level: EducationLevel): boolean {
	return level === EducationLevel.Elementary || level === EducationLevel.HighSchool;
}

async function processEntities(
	entities: EducationEntity[],
	userInput: UserInput,
): Promise<{ higherEducation: EducationEntity[]; underGraduationLevel: EducationLevel | undefined }> {
	let underGraduationLevel: EducationLevel | undefined;
	const higherEducation: EducationEntity[] = [];

	for (const entity of entities) {
		const resolvedLevel = await resolveFormationType(entity, userInput);

		if (isUnderGraduationLevel(resolvedLevel)) {
			if (
				resolvedLevel === EducationLevel.HighSchool ||
				!underGraduationLevel
			) {
				underGraduationLevel = resolvedLevel;
			}
			continue;
		}

		const courseName = await resolveCourseName(entity, userInput);
		const updatedEntity = { ...entity, course: courseName, level: resolvedLevel };
		higherEducation.push(updatedEntity);
	}

	return { higherEducation, underGraduationLevel };
}

function displaySuccessMessage(platformName: string): void {
	console.log(`
🎉 Sucesso!

A formação acadêmica foi sincronizada com a ${platformName} com base nos dados do LinkedIn.

ℹ️ Recomendação importante:
Após a sincronização, é altamente recomendável acessar a plataforma e
ajustar manualmente o nome do curso e da instituição para o padrão
utilizado pela plataforma. Isso melhora a legibilidade e aumenta a
compatibilidade com as ferramentas de ATS.

💙 Curtiu o projeto?
⭐ Favorite no GitHub – isso ajuda muito!
👉 https://github.com/enzoguinossi

🔗 Me siga no LinkedIn:
👉 https://www.linkedin.com/in/enzoguinossi/

— Enzo
`);
}

export async function syncLinkedinEducation(
	csvPath: string,
	dryRun: boolean,
	userInput: UserInput,
	platform?: Platform,
) {
	const educationEntities = parseLinkedinEducationCSV(csvPath);

	const { higherEducation, underGraduationLevel } = await processEntities(
		educationEntities,
		userInput,
	);

	if (dryRun) {
		console.log("🔎 DRY RUN – nenhum dado foi enviado");
		console.log(JSON.stringify({ higherEducation, underGraduationLevel }, null, 2));
		return;
	}

	await platform!.replaceEducation(higherEducation, underGraduationLevel);

	displaySuccessMessage(platform!.name);
}

export async function diffLinkedinEducation(
	csvPath: string,
	userInput: UserInput,
	platform: Platform,
) {
	const [educationEntities, platformEducation] = await Promise.all([
		parseLinkedinEducationCSV(csvPath),
		platform.getEducation(),
	]);

	const { higherEducation } = await processEntities(
		educationEntities,
		userInput,
	);

	return diffByKey(higherEducation, platformEducation, (e) =>
		platform.getEducationMatchKey(e),
	);
}