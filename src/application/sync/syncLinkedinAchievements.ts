import { Platform } from "@/platform/contracts/Platform.js";
import { validateCsvPath } from "@/shared/validators/validateCsvPath.js";
import { parseLinkedinAchievementsCSV } from "@/parsers/linkedin/achievement/linkedin.achievement.parser.js";
import { diffByKey } from "@/domain/services/diff.service.js";

export async function syncLinkedinAchievements(
	csvPath: string,
	dryRun: boolean,
	platform?: Platform,
) {
	validateCsvPath(csvPath);

	const linkedinAchievements = parseLinkedinAchievementsCSV(csvPath);

	if (dryRun) {
		console.log("🔎 DRY RUN – nenhum dado foi enviado");
		console.log(JSON.stringify(linkedinAchievements, null, 2));
		return;
	}

	await platform!.replaceAchievements(linkedinAchievements);
	const platformName = platform!.name;

	console.log(`
🎉 Sucesso!

Os certificados foram sincronizados com a ${platformName} com base nos dados do LinkedIn.

💙 Curtiu o projeto?
⭐ Favorite no GitHub — isso ajuda muito!
👉 https://github.com/enzoguinossi

🔗 Me siga no LinkedIn:
👉 https://www.linkedin.com/in/enzoguinossi/

— Enzo
`);
}

export async function diffLinkedinAchievements(
	csvPath: string,
	platform: Platform,
) {
	validateCsvPath(csvPath);

	const [linkedinAchievements, platformAchievements] = await Promise.all([
		parseLinkedinAchievementsCSV(csvPath),
		platform.getAchievements(),
	]);

	return diffByKey(linkedinAchievements, platformAchievements, (e) =>
		platform.getAchievementMatchKey(e),
	);
}