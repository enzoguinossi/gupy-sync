import { input, select } from "@inquirer/prompts";
import { UserInput } from "./userInput.types.js";
import { EducationLevel } from "@/domain/enums/education-level.enum.js";

const FORMATION_CHOICES: Array<{ name: string; value: EducationLevel }> = [
	{ name: "Ensino Fundamental", value: EducationLevel.Elementary },
	{ name: "Ensino Médio", value: EducationLevel.HighSchool },
	{ name: "Curso Técnico", value: EducationLevel.Technical },
	{ name: "Tecnólogo", value: EducationLevel.Technologist },
	{ name: "Graduação", value: EducationLevel.Bachelor },
	{ name: "Pós-Graduação", value: EducationLevel.PostGraduate },
	{ name: "Mestrado", value: EducationLevel.Master },
	{ name: "Doutorado", value: EducationLevel.Doctorate },
];

export const cliUserInput: UserInput = {
	async selectFormationType(context) {
		return select<EducationLevel>({
			message: `Qual o tipo da formação em "${context}"?`,
			choices: FORMATION_CHOICES,
		});
	},

	async askCourseName(context) {
		return input({
			message: `Qual o nome do curso em "${context}"?`,
			validate: (value) => value.trim().length > 0 || "Nome do curso é obrigatório",
		});
	},
};