import { Router } from "express";
import * as controller from "../../controllers/auth.controllers.js";
import { validateRequest } from "../../middleware/validation.js";
import {
	googleSignIn_Validator,
	signin_Validator,
	signup_Validator,
} from "../../validations/auth.validation.js";
import clientAuth from "../../utils/clientAuthReq.js";

const authRouter = Router();

authRouter.get("/authClient", clientAuth);

authRouter
	.route("/")
	.post(validateRequest(signup_Validator), controller.register)
	.get(validateRequest(googleSignIn_Validator), controller.signInByGoogle);
authRouter
	.route("/signin")
	.post(validateRequest(signin_Validator), controller.signInByEmail);

export default authRouter;
