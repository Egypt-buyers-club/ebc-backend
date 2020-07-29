import { RequestHandler } from "express";
import { HttpError } from "../models/error.model";
import { UserModel } from "../models/auth.model";

export const fetchUsersController: RequestHandler = async (req, res, next) => {
	let users;
	try {
		users = await UserModel.find({ activated: true }, "-password");
	} catch (err) {
		return next(new HttpError("Operation Failed, Try again later", 500));
	}
	res.status(200).json({
		users: users.map((user: any) => user.toObject({ getters: true }))
	});
};
