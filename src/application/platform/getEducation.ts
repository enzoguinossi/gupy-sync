import { Platform } from "@/platform/contracts/Platform.js";

export async function getEducation(platform: Platform) {
	return platform.getEducation();
}