import { parseLinkedinAchievementsCSV } from "@/parsers/linkedin/achievement/linkedin.achievement.parser.js";

export async function getLinkedinAchievements(csvPath: string) {
	return parseLinkedinAchievementsCSV(csvPath);
}
