import { string } from 'joi';
import { idSchema } from './id';

export const authIdScehma = idSchema;
const authEmailSchema = string().email();
const authPasswordSchema = string().min(8).max(50);

export const createAuthSchema = {
  email: authEmailSchema.required(),
  password: authPasswordSchema.required(),
}

export const updateAuthSchema = {
  email: authEmailSchema,
  password: authPasswordSchema,
}
