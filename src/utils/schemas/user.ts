import joi from 'joi';
import { idSchema } from './id';

export const userIdScehma = idSchema;
const userNameSchema = joi.string().max(50);
const userLastNameSchema = joi.string().max(100);
const userNickNameSchema = joi.string().max(50);
const userEmailSchema = joi.string().email();
const userAgeSchema = joi.number();
const userTeamSchema = joi.array().items(idSchema);
const userScheduleSchema = joi
  .array()
  .items(
    joi.object({ day: joi.string(), list: joi.array().items(joi.string()) })
  );
const userMeetingsSchema = joi
  .array()
  .items(
    joi.object({
      day: joi.string(),
      list: joi.array().items(joi.object({
        time: joi.string(),
        user: joi.string(),
      })),
    })
  );

export const createUserSchema = {
  age: userAgeSchema,
  name: userNameSchema.required(),
  email: userEmailSchema.required(),
  lastname: userLastNameSchema.required(),
  nickname: userNickNameSchema,
  team: userTeamSchema,
  schedule: userScheduleSchema,
};

export const updateUserSchema = {
  age: userAgeSchema,
  name: userNameSchema,
  email: userEmailSchema,
  lastname: userLastNameSchema,
  nickname: userNickNameSchema,
  team: userTeamSchema,
  schedule: userScheduleSchema,
  meetings: userMeetingsSchema,
};
