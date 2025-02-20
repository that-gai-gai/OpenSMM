import Joi from "joi";

export function validateLogin(login) {
  const JoiSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).options({ abortEarly: false });
  return JoiSchema.validate(login);
}

export function validatePost(post) {
  const JoiSchema = Joi.object({
    accounts: {
      twitter: Joi.array().required(), // change to optional when more platforms are added
    },
    text: Joi.string().optional(),
    attachment: Joi.string().optional(),
    datetime: Joi.date().raw().required(),
    pollDuration: Joi.number().optional(),
    pollOptions: Joi.array().optional(),
  }).options({ abortEarly: false });
  return JoiSchema.validate(post);
}

export function validateUser(user) {}
