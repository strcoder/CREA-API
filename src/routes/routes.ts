import authApi from './auth';
import teamApi from './team';
import userApi from './user';
import { createAuthSchema } from '../utils/schemas/auth';

const routes = (app: any) => {
  //** Rutas para el registro y login del usuario **//
  authApi(
    app,
    '/api/auth',
    createAuthSchema,
  );

  teamApi(
    app,
    {}
  );

  userApi(
    app,
    {}
  );
}

export default routes;
