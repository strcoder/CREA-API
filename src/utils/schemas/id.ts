import { string } from 'joi';

export const idSchema = string().regex(/^[0-9a-fA-F]{24}$/);
