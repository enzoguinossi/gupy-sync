import { createGupyHttpClient } from "./axiosClient"; 
import { createGupyCookieJar } from "./cookieJar";
import { GupyService } from "../../services/gupy/gupy.service.ts";


export async function createGupyClient() {
  const jar = await createGupyCookieJar();
  const http = createGupyHttpClient(jar);

  return new GupyService(http);
}