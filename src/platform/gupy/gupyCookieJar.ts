import { CookieJar } from "tough-cookie";

export async function createGupyCookieJar(token: string): Promise<CookieJar> {
	const jar = new CookieJar();

	await jar.setCookie(`candidate_secure_token=${token}`, "https://private-api.gupy.io");

	return jar;
}