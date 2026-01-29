import { input, select } from "@inquirer/prompts";
import { UserInput } from "./userInput.types.js";

import {
	GupyEducationTypes,
	GupyUnderGraduationTypes,
} from "../../parsers/gupy/education/gupy.education.types.js";

export const cliUserInput: UserInput = {
	async selectFormationType(context) {
		return select<GupyEducationTypes | GupyUnderGraduationTypes>({
			message: `Qual o tipo da formação em "${context}"?`,
			choices: [
				{ name: "Ensino Fundamental", value: GupyUnderGraduationTypes.completedElementarySchool },
				{ name: "Ensino Médio", value: GupyUnderGraduationTypes.completedHighSchool },
				{ name: "Curso Técnico", value: GupyEducationTypes.technical_course },
				{ name: "Tecnólogo", value: GupyEducationTypes.technological },
				{ name: "Graduação", value: GupyEducationTypes.graduation },
				{ name: "Pós-Graduação", value: GupyEducationTypes.post_graduate },
				{ name: "Mestrado", value: GupyEducationTypes.master_degree },
				{ name: "Doutorado", value: GupyEducationTypes.phd },
			],
		});
	},

	async askCourseName(context) {
		return input({
			message: `Qual o nome do curso em "${context}"?`,
			validate: (value) => value.trim().length > 0 || "Nome do curso é obrigatório",
		});
	},
};
