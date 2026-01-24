import {GupyAchievementTypes} from "../../../services/gupy/gupy.achievement.raw.types.js";

export interface LinkedinAchievementCSVRaw {
    Name: string;
    Url?: string;
    Authority: string;
}

export interface LinkedinAchievementParsed {
    Name: string;
    Url?: string;
    Authority: string;
}

export interface LinkedinAchievementDomain {
    Type: GupyAchievementTypes;
    Name: string;
    Description: string;
}