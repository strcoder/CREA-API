import joi from 'joi';
import { idSchema } from './id';

export const teamIdSchema = idSchema;
const teamNameSchema = joi.string();
const teamManagerSchema = idSchema;
const teamMemebersSchema = joi.array().items(idSchema);
const teamMeetingsSchema = joi.array().items(joi.object({ day: joi.string(), list: joi.string() }));

export const createTeamSchema = {
  name: teamNameSchema.required(),
  manager: teamManagerSchema,
  members: teamMemebersSchema,
  // meetings: teamMeetingsSchema,
}

export const updateTeamSchema = {
  name: teamNameSchema,
  manager: teamManagerSchema,
  members: teamMemebersSchema,
  meetings: teamMeetingsSchema,
}
