import Joi from "joi";

export const loginSchema = Joi.object({
    username: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(5).required()
});

export const tokenSchema = Joi.object({
    token: Joi.string().min(10).required(),
});
