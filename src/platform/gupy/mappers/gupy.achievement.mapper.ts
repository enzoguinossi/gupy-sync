import { AchievementEntity, AchievementType } from "@/domain/entities/achievement.entity.js";
import { GupyAchievementInput } from "../types/achievement/input/gupy.achievement.input.types.js";
import { GupyAchievementTypesEnum } from "../types/achievement/raw/gupy.achievement.raw.types.js";

export function mapAchievementToGupy(achievement: AchievementEntity): GupyAchievementInput {
	const descriptionParts: string[] = [];

	if (achievement.issuer) {
		descriptionParts.push(`Emitido por: ${achievement.issuer}`);
	}

	if (achievement.url) {
		descriptionParts.push(achievement.url);
	} else if (achievement.credentialId) {
		descriptionParts.push(`ID da licença: ${achievement.credentialId}`);
	}

	if (achievement.description) {
		descriptionParts.push(achievement.description);
	}

	return {
		type: mapAchievementTypeToGupy(achievement.type),
		name: achievement.name,
		description: descriptionParts.join(" | "),
	};
}

function mapAchievementTypeToGupy(type: AchievementType): GupyAchievementTypesEnum {
	switch (type) {
		case AchievementType.Course:
			return GupyAchievementTypesEnum.courses;
		case AchievementType.Certification:
			return GupyAchievementTypesEnum.certificates;
		case AchievementType.License:
			return GupyAchievementTypesEnum.certificates;
		case AchievementType.Award:
			return GupyAchievementTypesEnum.certificates;
		case AchievementType.Acknowledgement:
			return GupyAchievementTypesEnum.acknowledgements;
		case AchievementType.volunteerWork:
			return GupyAchievementTypesEnum.volunteerWork;
		default:
			return GupyAchievementTypesEnum.courses;
	}
}