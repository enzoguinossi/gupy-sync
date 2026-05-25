import { createGupyClient } from "@/infra/http/gupyClient.factory.js";
import { parseGupyAchievements } from "@/parsers/gupy/achievement/gupy.achievement.parser.js";

export async function getGupyAchievements() {
	const gupy = await createGupyClient();
	const data = await gupy.getAchievements();
	return parseGupyAchievements(data);
}
