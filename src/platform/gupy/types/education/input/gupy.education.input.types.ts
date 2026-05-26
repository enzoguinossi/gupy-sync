import {
	GupyEducationConclusionStatus,
	GupyEducationTypes,
	GupyUnderGraduationTypes,
} from "../enum/gupy.education.enum.js";

export interface GupyEducationInput {
	formation: GupyEducationTypes;
	conclusionStatus: GupyEducationConclusionStatus;
	course: string;
	institution: string;
	startDateMonth: number;
	startDateYear: string;
	endDateMonth: number;
	endDateYear: string;
}

export interface GupyEducationPayload {
	formations: GupyEducationInput[];
	underGraduationDegree?: GupyUnderGraduationTypes;
}