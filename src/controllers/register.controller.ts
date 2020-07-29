import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import { HttpError } from "../models/error.model";

import { UserModel } from "../models/auth.model";

import { RegisterCredentials } from "../types/auth.type";
import { registerSchema } from "../validators/auth.validator";
import { TokenModel } from "../models/token.model";
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

	// Send Email
	const transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.GMAIL_EMAIL,
			pass: process.env.GMAIL_PASSWORD
		}
	});
	const mailOptions = {
		from: process.env.GMAIL_EMAIL,
		to: (newUser as any).email,
		subject: "Account Verification Token",
		text: `Your Verification Code is: ${(emailToken as any).token}`
	};

	try {
		const info = await transporter.sendMail(mailOptions);
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
