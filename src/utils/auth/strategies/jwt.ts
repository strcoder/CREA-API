import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import boom from '@hapi/boom';

import AuthServices from '../../../services/auth';
import { config } from './../../../config';

passport.use(
  new Strategy({
    secretOrKey: config.authJwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, async (tokenPayload, cb) => {
    const authServices = new AuthServices();
    try {
      const user = await authServices.getAuth({ email: tokenPayload.email });
      if (!user) {
        cb(boom.unauthorized(), false);
      }

      delete user.password;
      cb(null, { ...user, scopes: tokenPayload.scopes });

    } catch (error) {
      cb(error)
    }
  })
);