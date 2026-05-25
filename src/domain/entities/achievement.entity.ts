export enum AchievementType {
	Course = "COURSE",
	Certification = "CERTIFICATION",
	License = "LICENSE",
	Award = "AWARD",
	Acknowledgement = "ACKNOWLEDGEMENT",
	volunteerWork = "VOLUNTEERWORK",
}

export interface AchievementEntity {
	name: string;
	type: AchievementType;
	issuer: string;

	description?: string;
	url?: string;
	credentialId?: string;

	issueDate?: {
		month: number;
		year: number;
	};
	expirationDate?: {
		month: number;
		year: number;
	};
}