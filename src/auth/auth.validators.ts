import Joi from "@hapi/joi";

export const registerSchema = Joi.object({
	name: Joi.string().min(6).required(),
	email: Joi.string().min(6).required().email(),
	password: Joi.string().min(6).required(),
	phone: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
	email: Joi.string().min(6).required().email(),
	password: Joi.string().min(6).required()
});
