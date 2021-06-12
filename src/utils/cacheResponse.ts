import { config } from './../config';

const cacheResponse = (res: any, seconds: any) => {
  if (!config.dev) {
    res.set('Cache-Control', `public, max-age=${seconds}`);
  }
}

export default cacheResponse;