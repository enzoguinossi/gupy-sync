export enum GupyAchievementTypesEnum {
	certificates = "certificates",
	courses = "courses",
	acknowledgements = "acknowledgements",
	volunteerWork = "volunteer_work",
}

export interface GupyAchievementRaw {
	id?: number;
	candidateId?: number;
	type: string;
	name: string;
	description?: string;
	createdAt?: string;
	updatedAt?: string;
	listId?: number;
}

export interface GupyAchievementsResponse {
	achievements: GupyAchievementRaw[];
}