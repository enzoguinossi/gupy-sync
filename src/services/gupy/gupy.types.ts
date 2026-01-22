export enum AchievementTypes {
    courses="courses",
    certificates="certificates"
}

export interface Achievement {
    id?: number;
    candidateId?: number; 
    type: AchievementTypes;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    listId?: number
}

export interface AchievementResponse {
  achievements: Achievement[];
}

export interface UpdateAchievementsPayload {
  achievements: Achievement[];
}
