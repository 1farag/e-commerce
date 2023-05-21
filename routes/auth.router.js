import express from "express";
import * as controller from "../controllers/auth.controllers.js";
import { validateRequest } from "../middleware/validation.js";
import {
	googleSignIn_Validator,
	signin_Validator,
	signup_Validator,
} from "../validations/auth.validation.js";

const userRouter = express.Router();

userRouter
	.route("/")
	.post(validateRequest(signup_Validator), controller.register)
	.get(validateRequest(googleSignIn_Validator), controller.signInByGoogle);
userRouter
	.route("/signin")
	.post(validateRequest(signin_Validator), controller.signInByEmail);

export default userRouter;
