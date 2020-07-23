import { Request } from "express";
export interface IGetUserAuthInfoRequest extends Request {
	user: string;
}

export interface RegisterCredentials {
	name: string;
	email: string;
	phone: string;
	password: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}
