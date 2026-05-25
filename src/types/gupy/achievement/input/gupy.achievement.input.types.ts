import { GupyAchievementTypesEnum } from "@/types/gupy/achievement/raw/gupy.achievement.raw.types.js";

export interface GupyAchievementInput {
	type: GupyAchievementTypesEnum;
	name: string;
	description?: string;
}

export interface GupyAchievementsPayload {
	achievements: GupyAchievementInput[];
}