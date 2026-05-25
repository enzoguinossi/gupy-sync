import { LinkedinDates } from "@/types/linkedin/shared/linkedin.shared.types.js";

export interface LinkedinEducationRaw {
	"School Name": string;
	"Start Date": string;
	"End Date": string;
	Notes?: string;
	"Degree Name"?: string;
	Activities?: string;
}

export interface LinkedinEducationParsed {
	School_Name: string;
	Start_Date: LinkedinDates;
	End_Date: LinkedinDates;
	Degree_Name?: string;
	Notes?: string;
}