import { createGupyClient } from "../infra/http/gupyClient.factory.js";

export async function getGupyAchievements() {
        const gupy = await createGupyClient();
        return gupy.getAchievements();
}