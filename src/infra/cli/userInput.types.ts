import { EducationLevel } from "@/domain/enums/education-level.enum.js";

export interface UserInput {
	selectFormationType(context: string): Promise<EducationLevel>;
	askCourseName(context: string): Promise<string>;
}