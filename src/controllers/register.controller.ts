import { RequestHandler } from "express";
import bcrypt from "bcryptjs";

import { HttpError } from "../models/error.model";
import { UserModel } from "../models/auth.model";
import { TokenModel } from "../models/token.model";

import { sendMail } from "../services/mail.service";

import { RegisterCredentials } from "../types/auth.type";
import { registerSchema } from "../validators/auth.validator";
import { generateVerificationCode } from "../utils";

export const registerController: RequestHandler = async (req, res, next) => {
	// Validate Request Body
	const { error } = registerSchema.validate(req.body);
	if (error) return next(new HttpError(error.details[0].message, 422));

	// check if user already exists
	let existingUser;
	try {
		existingUser = await UserModel.findOne({ email: req.body.email });
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	if (existingUser) return next(new HttpError("User Already Exists.", 500));

	// hash password
	let hashedPassword: string;
	try {
		hashedPassword = await bcrypt.hash(req.body.password, 12);
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	// create user
	const newUser = new UserModel(<RegisterCredentials>{
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		password: hashedPassword
	});

	// Create a verification token for this user
	const emailToken = new TokenModel({
		_userId: newUser._id,
		token: generateVerificationCode()
	});

	// save token
	try {
		await emailToken.save();
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	const [transporter, mailOptions] = sendMail(
		(newUser as any).email,
		(emailToken as any).token
	);
	try {
		const info = await (transporter as any).sendMail(mailOptions);
		console.log(info.messageId);
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	// Save user
	let savedUser;
	try {
		savedUser = await newUser.save();
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	return res.status(201).json({
		id: (savedUser as any).id,
		activated: (savedUser as any).activated
	});
};
