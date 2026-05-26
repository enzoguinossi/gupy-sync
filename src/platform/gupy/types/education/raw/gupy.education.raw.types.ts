export interface GupyFormationRaw {
	id: number;
	formation: string;
	conclusionStatus: string;
	course: string;
	institution: string;
	orgEid: string;
	startDateMonth: number;
	startDateYear: number;
	endDateMonth: number;
	endDateYear: number;
}

export interface GupyFormationsRaw {
	academicFormation: GupyFormationRaw[];
	underGraduationDegree: string;
}