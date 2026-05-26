import { createGupyHttpClient } from "./gupyHttp.client.js";
import { createGupyCookieJar } from "./gupyCookieJar.js";
import { GupyHttpService } from "./GupyHttpService.js";

export async function createGupyClient(token: string) {
	const jar = await createGupyCookieJar(token);
	const http = createGupyHttpClient(jar);

	return new GupyHttpService(http);
}