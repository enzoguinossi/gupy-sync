import { Platform } from "@/platform/contracts/Platform.js";

export async function getAchievements(platform: Platform) {
	return platform.getAchievements();
}