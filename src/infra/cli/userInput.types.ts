import {
	GupyEducationTypes,
	GupyUnderGraduationTypes,
} from "../../parsers/gupy/education/gupy.education.types.js";

export interface UserInput {
	selectFormationType(context: string): Promise<GupyEducationTypes | GupyUnderGraduationTypes>;
	askCourseName(context: string): Promise<string>;
}
