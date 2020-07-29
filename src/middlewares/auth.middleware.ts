import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../models/error.model";
import { IGetUserAuthInfoRequest } from "../types/auth.type";

export const checkAuth: RequestHandler = (req, res, next) => {
	try {
		const token = req.headers.authorization;
		if (!token) {
			throw new Error("Not Authenticated!");
		}
		const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
		(req as IGetUserAuthInfoRequest).user = decodedToken.id;
		next();
	} catch (error) {
		return next(new HttpError("Not Authenticated!", 401));
	}
};
