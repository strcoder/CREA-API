import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import AuthService from '../../../services/auth';


passport.use(new BasicStrategy(async (email, password, cb) => {
  const authService = new AuthService();
  try {
    const user = await authService.getAuth({ email });
    if (!user || Object.entries(user).length === 0) {
      return cb(boom.unauthorized(), false);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return cb(boom.unauthorized(), false);
    }

    delete user.password;
    return cb(null, user);

  } catch (error) {
    return cb(error);
  }
}));