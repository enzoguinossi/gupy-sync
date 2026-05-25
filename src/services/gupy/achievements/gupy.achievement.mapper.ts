import { AchievementEntity, AchievementType } from "@/domain/entities/achievement.entity.js";
import { GupyAchievementInput } from "@/types/gupy/achievement/input/gupy.achievement.input.types.js";
import { GupyAchievementTypesEnum } from "@/types/gupy/achievement/raw/gupy.achievement.raw.types.js";

/**
 * Maps a domain AchievementEntity to a GupyAchievementInput.
 *
 * This function transforms the domain representation of an achievement into the format
 * expected by the Gupy API. It handles the mapping of achievement types and constructs
 * a description string that includes issuer, URL, and credential ID information.
 *
 * @param achievement - The achievement entity from the domain layer.
 * @returns The achievement input object formatted for Gupy.
 */
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

/**
 * Maps a domain AchievementType to a GupyAchievementTypes.
 *
 * @param type - The achievement type from the domain layer.
 * @returns The corresponding Gupy achievement type.
 */
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
