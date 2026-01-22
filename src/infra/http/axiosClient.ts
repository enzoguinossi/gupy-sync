import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

export function createGupyHttpClient(jar: CookieJar): AxiosInstance {
  return wrapper(
    axios.create({
      baseURL: 'https://private-api.gupy.io',
      jar,
      withCredentials: true,
      maxBodyLength: Infinity,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0',
        Accept: 'application/json',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        Referer: 'https://login.gupy.io/',
        Origin: 'https://login.gupy.io',
        'Content-Type': 'application/json',
      },
    })
  );
}
