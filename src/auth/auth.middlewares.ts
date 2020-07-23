import { any } from "@hapi/joi";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../app/app.models";
import { IGetUserAuthInfoRequest } from "./auth.types";

export const checkAuth = (
	req: IGetUserAuthInfoRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization;
		if (!token) {
			throw new Error("Not Authenticated!");
		}
		const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
		req.user = decodedToken.id;
		next();
	} catch (error) {
		return next(new HttpError("Not Authenticated!", 401));
	}
};
