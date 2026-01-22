import { createGupyClient } from "../infra/http/gupyClient.factory";

export async function getGupyAchievements() {
        const gupy = await createGupyClient();
        return gupy.getAchievements();
}