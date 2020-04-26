import * as Joi from 'joi';

export const createUser: Joi.SchemaMap = {
  username: Joi.string()
    .trim()
    .required(),
  password: Joi.string()
    .trim()
    .required()
};

export const changePass: Joi.SchemaMap = {
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
};

export const login: Joi.SchemaMap = {
  username: Joi.string()
    .trim()
    .required(),
  password: Joi.string()
    .trim()
    .required()
};
