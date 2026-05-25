import {
	GupyEducationTypes,
	GupyUnderGraduationTypes,
} from "@/types/gupy/education/enum/gupy.education.enum.js";

export interface UserInput {
	selectFormationType(context: string): Promise<GupyEducationTypes | GupyUnderGraduationTypes>;
	askCourseName(context: string): Promise<string>;
}
