import { string } from 'joi';
import { idSchema } from './id';

export const authIdScehma = idSchema;
const authNameSchema = string().max(50);
const authEmailSchema = string().email();
const authLastNameSchema = string().max(100);
const authPasswordSchema = string().min(8).max(50);

export const createAuthSchema = {
  name: authNameSchema.required(),
  email: authEmailSchema.required(),
  lastname: authLastNameSchema.required(),
  password: authPasswordSchema.required(),
}

export const updateAuthSchema = {
  email: authEmailSchema,
  password: authPasswordSchema,
}
