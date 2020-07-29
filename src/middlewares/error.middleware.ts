import { Request, Response, NextFunction, RequestHandler } from "express";

import { HttpError } from "../models/error.model";

export const errorMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.headersSent) {
		return next(err);
	}
	res.status((err as any).code || 500);
	res.json({ error: err.message || "An Error Occured, please try again." });
};

export const notFoundMiddleware: RequestHandler = (req, res, next) => {
	next(new HttpError("404, Not Found.", 404));
};
