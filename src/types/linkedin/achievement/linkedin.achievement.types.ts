import { LinkedinDates } from "@/types/linkedin/shared/linkedin.shared.types.js";

export interface LinkedinAchievementRaw {
	Name: string;
	Url?: string;
	Authority: string;
	"Started On"?: string;
	"Finished On"?: string;
	"License Number"?: string;
}

export interface LinkedinAchievementParsed {
	Name: string;
	Url?: string;
	Authority: string;
	Started_On?: LinkedinDates;
	Finished_On?: LinkedinDates;
	License_Number?: string;
}