import { createGupyHttpClient } from "@/infra/http/axiosClient.js";
import { createGupyCookieJar } from "@/infra/http/cookieJar.js";
import { GupyService } from "@/services/gupy/gupy.service.js";

export async function createGupyClient() {
	const jar = await createGupyCookieJar();
	const http = createGupyHttpClient(jar);

	return new GupyService(http);
}
