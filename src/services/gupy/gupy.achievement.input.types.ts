import {GupyAchievementTypes} from "./gupy.achievement.raw.types.js";

export interface GupyAchievementInput {
    type: GupyAchievementTypes;
    name: string;
    description?: string;
}

export interface GupyAchievementsPayload {
    achievements: GupyAchievementInput[];
}