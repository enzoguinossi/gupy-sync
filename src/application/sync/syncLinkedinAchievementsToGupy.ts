import { createGupyClient } from "@/infra/http/gupyClient.factory.js";
import { validateCsvPath } from "@/shared/validators/validateCsvPath.js";
import { parseLinkedinAchievementsCSV } from "@/parsers/linkedin/achievement/linkedin.achievement.parser.js";
import { buildAchievementsPayload } from "@/services/gupy/payloads/gupy.payload.js";
import { mapAchievementToGupy } from "@/services/gupy/achievements/gupy.achievement.mapper.js";

/**
 * Synchronizes LinkedIn achievements to Gupy.
 *
 * This function reads a CSV file containing LinkedIn achievements, parses them into domain entities,
 * maps them to the Gupy format, and then either performs a dry run (logging the payload) or
 * sends the data to the Gupy API to replace existing achievements.
 *
 * @param csvPath - The file path to the LinkedIn achievements CSV.
 * @param dryRun - If true, the function will only log the payload without sending it to the API.
 * @returns A promise that resolves when the synchronization process is complete.
 */
export async function syncGupyToLinkedin(csvPath: string, dryRun: boolean) {
	validateCsvPath(csvPath);

	const linkedinAchievements = parseLinkedinAchievementsCSV(csvPath);
	const gupyAchievements = linkedinAchievements.map(mapAchievementToGupy);
	const payload = buildAchievementsPayload(gupyAchievements);

	if (dryRun) {
		console.log("🔎 DRY RUN – nenhum dado foi enviado");
		console.log(JSON.stringify(payload, null, 2));
		return;
	}

	const gupy = await createGupyClient();

	await gupy.replaceAchievements(payload);
	console.log(`
🎉 Sucesso!

Os certificados foram sincronizados com a Gupy com base nos dados do LinkedIn.

💙 Curtiu o projeto?
⭐ Favorite no GitHub — isso ajuda muito!
👉 https://github.com/enzoguinossi

🔗 Me siga no LinkedIn:
👉 https://www.linkedin.com/in/enzoguinossi/

— Enzo
`);
}
