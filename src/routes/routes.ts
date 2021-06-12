import authApi from './auth';
import { createAuthSchema } from '../utils/schemas/auth';

const routes = (app: any) => {
  //** Rutas para el registro y login del usuario **//
  authApi(
    app,
    '/api/auth',
    createAuthSchema,
  );
}

export default routes;
