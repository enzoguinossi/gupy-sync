import { CookieJar } from 'tough-cookie';
import { env } from '../../config/env';


export async function createGupyCookieJar(): Promise<CookieJar> {
  const jar = new CookieJar();

  await jar.setCookie(
    `candidate_secure_token=${env.GUPY_TOKEN}`,
    'https://private-api.gupy.io'
  );
  
  return jar;
}
