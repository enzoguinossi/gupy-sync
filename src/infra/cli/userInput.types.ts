import {GupyEducationTypes} from "../../services/gupy/gupy.education.input.types.js";

export interface UserInput {
    selectFormationType(context: string): Promise<GupyEducationTypes>;
    askCourseName(context: string): Promise<string>;
}
