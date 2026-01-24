export enum GupyEducationTypes {
    technical_course = 'technical_course',
    technological = "technological",
    graduation    = 'graduation',
    post_graduate = 'post_graduate',
    master_degree = 'master_Degree',
    phd           = 'phd',
}

export enum GupyEducationConclusionStatus {
    education_complete = "complete",
    education_in_progress = "in_progress"
}

export enum GupyUnderGraduationTypes {
    fundamental = "completed_elementary_school",
    high_school = "completed_high_school"
}

export interface GupyEducationInput {
    formation: GupyEducationTypes,
    conclusionStatus: GupyEducationConclusionStatus,
    course: string,
    institution: string,
    startDateMonth: number,
    startDateYear: string,
    endDateMonth: number,
    endDateYear: string
}

export interface GupyEducationPayload {
    formations: GupyEducationInput[],
    underGraduationDegree?: GupyUnderGraduationTypes
}