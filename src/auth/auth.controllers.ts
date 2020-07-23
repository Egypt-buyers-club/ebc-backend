import { RequestHandler } from "express";
import { RegisterCredentials } from "./auth.types";

export const registerController: RequestHandler = (req, res, next) => {
  const newUser = req.body as RegisterCredentials;
  console.log(newUser);
  res.status(201).json({ user: newUser });
};
