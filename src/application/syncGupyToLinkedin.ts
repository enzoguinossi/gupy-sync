import { createGupyClient } from "../infra/http/gupyClient.factory";
import { validateCsvPath } from "../shared/validators/validateCsvPath";
import { parseLinkedinCSV } from "../parsers/linkedin/linkedin.parser";
import { buildAchievementsPayload } from "../services/gupy/gupy.payload";

export async function syncGupyToLinkedin(csvPath:string, dryRun:boolean) {
    validateCsvPath(csvPath);
    
            const achievements = parseLinkedinCSV(csvPath);
            const payload = buildAchievementsPayload(achievements);
    
            if (dryRun) {
                console.log(JSON.stringify(payload, null, 2));
                return;
            }
    
            const gupy = await createGupyClient();
    
            await gupy.replaceAchievements(payload);
}