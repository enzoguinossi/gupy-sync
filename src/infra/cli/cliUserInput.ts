// infra/cli/cliUserInput.ts
import { select, input } from '@inquirer/prompts';
import { UserInput } from './userInput.types';
import {GupyEducationTypes} from "../../services/gupy/gupy.education.input.types.js";


export const cliUserInput: UserInput = {
    async selectFormationType(context) {
        return select<GupyEducationTypes>({
            message: `Qual o tipo da formação em "${context}"?`,
            choices: [
                { name: 'Curso Técnico', value: GupyEducationTypes.technical_course},
                { name: 'Tecnólogo', value: GupyEducationTypes.technological},
                { name: 'Graduação', value: GupyEducationTypes.graduation},
                { name: 'Pós-Graduação', value: GupyEducationTypes.post_graduate},
                { name: 'Mestrado', value: GupyEducationTypes.master_degree},
                { name: 'Doutorado', value: GupyEducationTypes.phd},]
        });
    },

    async askCourseName(context) {
        return input({
            message: `Qual o nome do curso em "${context}"?`,
            validate: value =>
                value.trim().length > 0 || 'Nome do curso é obrigatório',
        });
    },
};
