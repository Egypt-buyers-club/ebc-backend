import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { HttpError } from "../app/app.models";

import { UserModel } from "./auth.models";

import { RegisterCredentials, LoginCredentials } from "./auth.types";
import { registerSchema, loginSchema } from "./auth.validators";

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

	// Save user
	let savedUser;
	try {
		savedUser = await newUser.save();
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	// create jwt
	let token;
	try {
		token = jwt.sign({ userId: savedUser.id }, process.env.JWT_SECRET!, {
			expiresIn: "2h"
		});
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	return res.status(201).json({ token: token });
};

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

	// create jwt
	let token;
	try {
		token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
			expiresIn: "2h"
		});
	} catch (error) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}

	return res.status(200).json({ token: token });
};

export const fetchUsersController: RequestHandler = async (req, res, next) => {
	let users;
	try {
		users = await UserModel.find({}, "-password");
	} catch (err) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}
	res.status(200).json({
		users: users.map((user: any) => user.toObject({ getters: true }))
	});
};
