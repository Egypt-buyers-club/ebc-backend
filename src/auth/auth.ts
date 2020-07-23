import { Router } from "express";

import {
	registerController,
	loginController,
	fetchUsersController
} from "./auth.controllers";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/", fetchUsersController);

export { router as authRoutes };
