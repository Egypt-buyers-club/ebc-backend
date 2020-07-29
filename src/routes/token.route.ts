import { Router } from "express";

import { tokenController } from "../controllers/token.controller";

const router = Router();

router.post("/verify", tokenController);

export { router as tokenRoutes };
