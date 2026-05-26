import { Platform } from "@/platform/contracts/Platform.js";
import { AchievementEntity } from "@/domain/entities/achievement.entity.js";
import { EducationEntity } from "@/domain/entities/education.entity.js";
import { createGupyClient } from "./GupyClientFactory.js";
import { parseGupyAchievements } from "./parsers/gupy.achievement.parser.js";
import { parseGupyEducation } from "./parsers/gupy.education.parser.js";
import { mapAchievementToGupy } from "./mappers/gupy.achievement.mapper.js";
import { buildAchievementsPayload, buildEducationPayload } from "./payloads/gupy.payload.js";
import { mapEducationLevelToGupy, mapToGupyEducationInput } from "./mappers/gupy.education.mapper.js";
import {
	GupyEducationTypes,
	GupyUnderGraduationTypes,
} from "./types/education/enum/gupy.education.enum.js";

function normalize(str: string): string {
	return str.trim().toLowerCase();
}

export class GupyPlatform implements Platform {
	readonly name = "gupy";

	constructor(private readonly token: string) {}

	getAchievementMatchKey(entity: AchievementEntity): string {
		return normalize(entity.name);
	}

	getEducationMatchKey(entity: EducationEntity): string {
		return `${normalize(entity.institution)}|${entity.level}`;
	}

	async getAchievements(): Promise<AchievementEntity[]> {
		const client = await createGupyClient(this.token);
		const data = await client.getAchievements();
		return parseGupyAchievements(data);
	}

	async replaceAchievements(achievements: AchievementEntity[]): Promise<void> {
		const client = await createGupyClient(this.token);
		const gupyInputs = achievements.map(mapAchievementToGupy);
		const payload = buildAchievementsPayload(gupyInputs);
		await client.replaceAchievements(payload);
	}

	async getEducation(): Promise<EducationEntity[]> {
		const client = await createGupyClient(this.token);
		const data = await client.getEducation();
		return parseGupyEducation(data);
	}

	async replaceEducation(
		education: EducationEntity[],
		underGraduationDegree?: string,
	): Promise<void> {
		const client = await createGupyClient(this.token);
		const finalFormations = education.map((entity) => {
			const mappedType = mapEducationLevelToGupy(entity.level);
			const gupyType = (
				mappedType === "unknown" ? GupyEducationTypes.technical_course : mappedType
			) as GupyEducationTypes;

			return mapToGupyEducationInput(entity, gupyType);
		});

		const underGraduation = underGraduationDegree
			? (underGraduationDegree as GupyUnderGraduationTypes)
			: finalFormations.length > 0
				? GupyUnderGraduationTypes.completedHighSchool
				: undefined;

		const payload = buildEducationPayload({
			formations: finalFormations,
			underGraduationDegree: underGraduation,
		});

		await client.replaceAcademicFormation(payload);
	}
}