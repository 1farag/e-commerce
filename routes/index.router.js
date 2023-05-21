import { Router } from "express";
import userRouter from "./auth.router.js";

const router = Router();

router.use("/auth", userRouter);

export default router;
