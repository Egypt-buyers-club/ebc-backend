import { Router } from "express";

import { tokenController } from "./token.controllers";

const router = Router();

router.post("/verify", tokenController);

export { router as tokenRoutes };
