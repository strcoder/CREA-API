import express from 'express';
import passport from 'passport';
import boom  from '@hapi/boom';
import jwt from 'jsonwebtoken';
import AuthServices from '../services/auth';
import validationHandler from'./../utils/middleware/validationHandler';
import { config } from'./../config';
import './../utils/auth/strategies/basic'; // Basic strategy

const authApi = (app: any, route: string, registerSchema: any) => {
  const router = express.Router();
  app.use(route, router);
  const authService = new AuthServices();

  router.post('/sign-in', async (req, res, next) => {
    passport.authenticate('basic', (error, user) => {
      try {
        if (error || !user) {
          next(boom.unauthorized());
        }
        req.login(user, { session: false }, async (error) => {
          if (error || !user) {
            next(error);
            return;
          }
          const { _id: id, email, user: key } = user;

          const payload = {
            sub: id,
            email,
          }
          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '60m'
          });
          return res.status(200).json({
            token,
            user: { id: key, email }
          });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });

  router.post(`/sign-up`, validationHandler(registerSchema), async (req, res, next) => {
    const { body: user } = req;
    try {
      const emailDistinct = await authService.getAuthDistinct({ attribute: 'email' });
      const listEmail = emailDistinct.map((d: string) => d.toLowerCase());
      if (listEmail.includes(user.email.toLowerCase())) {
        res.status(409).json({
          data: [],
          message: 'User already exists'
        });
        return;
      } else {
        const auth = {
          email: user.email,
          password: user.password,
        }
        const authId = await authService.createAuth({ auth });
        res.status(201).json({
          data: authId,
          message: `${user.email} created`,
        });
      }
    } catch (error) {
      next(error);
    }
  });

  router.post(`/validate-user`, async (req, res, next) => {
    const { body: user } = req;
    try {
      const userExist = await authService.getAuth({ email: user.email });
      if (userExist) {
        res.status(409).json({
          data: {},
          message: 'User already exists'
        });
      } else {
        res.status(200).json({
          data: {},
          message: `User can register`,
        });
      }
    } catch (error) {
      next(error);
    }
  });
}

export default authApi;