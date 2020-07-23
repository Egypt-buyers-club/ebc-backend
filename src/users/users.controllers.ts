import { RequestHandler } from "express";
import { User } from "./users.types";

export const registerController: RequestHandler = (req, res, next) => {
  const newUser = req.body as User;
  console.log(newUser);
  res.status(201).json({ user: newUser });
};
