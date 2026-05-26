import { AchievementEntity } from "@/domain/entities/achievement.entity.js";
import { EducationEntity } from "@/domain/entities/education.entity.js";

export interface Platform {
	readonly name: string;

	getAchievementMatchKey(entity: AchievementEntity): string;
	getEducationMatchKey(entity: EducationEntity): string;

	getAchievements(): Promise<AchievementEntity[]>;
	replaceAchievements(achievements: AchievementEntity[]): Promise<void>;

	getEducation(): Promise<EducationEntity[]>;
	replaceEducation(
		education: EducationEntity[],
		underGraduationDegree?: string,
	): Promise<void>;
}