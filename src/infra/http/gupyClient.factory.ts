import { createGupyHttpClient } from "./axiosClient.js";
import { createGupyCookieJar } from "./cookieJar.js";
import { GupyService} from "../../services/gupy/gupy.service.js";


export async function createGupyClient() {
  const jar = await createGupyCookieJar();
  const http = createGupyHttpClient(jar);

  return new GupyService(http);
}