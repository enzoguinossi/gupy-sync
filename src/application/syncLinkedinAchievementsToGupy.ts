import { createGupyClient } from "../infra/http/gupyClient.factory.js";
import { validateCsvPath } from "../shared/validators/validateCsvPath.js";
import { parseLinkedinAchievementsCSV } from "../parsers/linkedin/achievement/linkedin.achievement.parser.js";
import { buildAchievementsPayload } from "../services/gupy/gupy.payload.js";
import { mapLinkedinAchievementToGupy} from "../services/gupy/gupy.achievement.mapper.js";

export async function syncGupyToLinkedin(csvPath:string, dryRun:boolean) {
    validateCsvPath(csvPath);
    
            const linkedinAchievements = parseLinkedinAchievementsCSV(csvPath);
            const gupyAchievements = linkedinAchievements.map( mapLinkedinAchievementToGupy );
            const payload = buildAchievementsPayload(gupyAchievements);
    
            if (dryRun) {
                console.log(JSON.stringify(payload, null, 2));
                return;
            }
    
            const gupy = await createGupyClient();
    
            await gupy.replaceAchievements(payload);
    console.log(`
🎉 Sucesso!

Os certificados foram sincronizadados com a Gupy com base nos dados do LinkedIn.

💙 Curtiu o projeto?
⭐ Favorite no GitHub — isso ajuda muito!
👉 https://github.com/enzoguinossi

🔗 Me siga no LinkedIn:
👉 https://www.linkedin.com/in/enzoguinossi/

— Enzo
`);

}