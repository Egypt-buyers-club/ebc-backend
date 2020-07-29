import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { HttpError } from "../models/error.model";

import { UserModel } from "../models/auth.model";

import { loginSchema } from "../validators/auth.validator";

export const loginController: RequestHandler = async (req, res, next) => {
	// Validate Request Body
	const { error } = loginSchema.validate(req.body);
	if (error) next(new HttpError(error.details[0].message, 400));

	// check if user exists
	let user: any;
	try {
		user = await UserModel.findOne({ email: req.body.email });
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	if (!user) return next(new HttpError("Wrong Email or password.", 401));

	// check password
	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(req.body.password, user.password);
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	if (!isValidPassword)
		return next(new HttpError("Wrong Email or password.", 401));

	if (!user.activated) {
		return res.status(200).json({ id: user.id, activated: user.activated });
	}
	// create jwt
	let token;
	try {
		token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
			expiresIn: "2h"
		});
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	return res.status(200).json({ token: token, activated: user.activated });
};
