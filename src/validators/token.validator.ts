import Joi from "@hapi/joi";

export const tokenSchema = Joi.object({
	id: Joi.string().min(6).required(),
	token: Joi.string().min(6).required()
});
