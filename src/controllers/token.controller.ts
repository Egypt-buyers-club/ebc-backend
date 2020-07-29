import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../models/error.model";
import { UserModel } from "../models/auth.model";
import { TokenModel } from "../models/token.model";

import { tokenSchema } from "../validators/token.validator";

export const tokenController: RequestHandler = async (req, res, next) => {
	// validate errors
	const { error } = tokenSchema.validate(req.body);
	if (error) return next(new HttpError(error.details[0].message, 422));

	// fetch user
	let user;
	try {
		user = await UserModel.findById(req.body.id);
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	// check if user exists
	if (!user) {
		return next(new HttpError("Wrong Data, Try again later", 500));
	}

	// get matching token
	let token;
	try {
		token = await TokenModel.findOne({
			_userId: user!.id
		});
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	// if not token
	if (!token) {
		return next(new HttpError("Invalid Validation Code", 400));
	}

	// check if user is already activated
	if ((user! as any).activated) {
		return next(new HttpError("User is already verified", 400));
	}

	// check if token is correct
	if (!((token as any).token == req.body.token)) {
		return next(new HttpError("Wrong Validation Code", 400));
	}

	// update user
	(user! as any).activated = true;

	// save updated user
	let savedUser;
	try {
		savedUser = await user!.save();
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	// delete token
	try {
		await token.remove();
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	// create jwt
	let authToken;
	try {
		authToken = jwt.sign({ userId: savedUser.id }, process.env.JWT_SECRET!, {
			expiresIn: "2h"
		});
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	return res
		.status(200)
		.json({ token: authToken, activated: (savedUser as any).activated });
};
