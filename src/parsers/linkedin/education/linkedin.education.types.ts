import {
    GupyEducationConclusionStatus,
    GupyEducationTypes,
    GupyUnderGraduationTypes
} from "../../../services/gupy/gupy.education.input.types.js";

export type LinkedinDatesMonths =
'Jan' | 'Feb' | 'Mar' |
'Apr' | 'May' | 'Jun' | 
'Jul' | 'Aug' | 'Sep' | 
'Oct' | 'Nov' | 'Dec';

interface LinkedinDates {
    Month: LinkedinDatesMonths;
    Year: number;
}

export interface LinkedinEducationRaw {
    'School Name': string;
    'Start Date': string;
    'End Date': string;
    'Notes'?: string;
    'Degree Name'?: string;
    'Activities'?: string;
}

export interface LinkedinEducationParsed {
    School_Name: string;
    Start_Date: LinkedinDates;
    End_Date: LinkedinDates;
    Degree_Name?: string;
}

export type NormalizedEducationRow =
    | { kind: 'underGraduation'; value: GupyUnderGraduationTypes }
    | { kind: 'formation'; value: LinkedinEducationDomain };

export interface LinkedinEducationDomain {
    formation: GupyEducationTypes | 'unknown';
    conclusionStatus: GupyEducationConclusionStatus;
    course?: string;
    institution: string;
    startDateMonth: number;
    startDateYear: number;
    endDateMonth: number;
    endDateYear: number;
}

export interface LinkedinUnderGraduationDomain {
    underGraduationDegree: GupyUnderGraduationTypes
}