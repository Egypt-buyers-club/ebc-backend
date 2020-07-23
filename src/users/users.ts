import { Router } from "express";

import { registerController } from "./users.controllers";

const router = Router();

router.post("/register", registerController);
router.post("/login");
router.get("/");

export default router;
