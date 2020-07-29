import { Router } from "express";

import { registerController } from "../controllers/register.controller";
import { loginController } from "../controllers/login.controller";
import { fetchUsersController } from "../controllers/getusers.controller";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/", fetchUsersController);

export { router as authRoutes };
