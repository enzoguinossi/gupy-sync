export enum GupyAchievementTypes {
    course = 'courses',
    certificate = 'certificates'
}

export interface GupyAchievementRaw {
    id?: number;
    candidateId?: number; 
    type: GupyAchievementTypes;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    listId?: number
}

export interface GupyAchievementsResponse {
    achievements: GupyAchievementRaw[];
}

