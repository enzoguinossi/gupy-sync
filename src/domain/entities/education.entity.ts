import { EducationLevel } from "@/domain/enums/education-level.enum.js";
import { EducationStatus } from "@/domain/enums/education-status.enum.js";

export interface EducationEntity {
	institution: string;
	course?: string;
	level: EducationLevel;
	status: EducationStatus;

	startDate: {
		month: number;
		year: number;
	};

	endDate?: {
		month: number;
		year: number;
	};
}