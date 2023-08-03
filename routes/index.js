import { Router } from "express";
import v0Router from "./v0/index.router.js";

const router = Router();

router.use("/v0", v0Router);

export default router;
