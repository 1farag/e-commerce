import { Router } from "express";
import * as controller from "../../controllers/auth.controllers.js";
import { validateRequest } from "../../middleware/validation.js";
import {
	changePassword_Validator,
	forgotPassword_Validator,
	googleSignIn_Validator,
	resetPassword_Validator,
	signin_Validator,
	signup_Validator,
	verifyEmailValidator,
} from "../../validations/auth.validation.js";
import clientAuth from "../../utils/clientAuthReq.js";
import { auth } from "../../middleware/auth.js";
import { getUserByIdValidator } from "../../validations/user.validation.js";

const authRouter = Router();

authRouter.get("/authClient", clientAuth);

authRouter.post(
	"/google",
	validateRequest(googleSignIn_Validator),
	controller.signInByGoogle
);

authRouter.post("/signup", validateRequest(signup_Validator), controller.register);

authRouter.post("/signin", validateRequest(signin_Validator), controller.signInByEmail);

authRouter.post("/signout", auth, controller.logout);

// verify email
authRouter.get(
	"/verify-email/:token",
	auth,
	validateRequest(verifyEmailValidator),
	controller.verifyEmail
);

// refresh email
authRouter.get(
	"/resend-email/:userId",
	validateRequest(getUserByIdValidator),
	controller.refreshEmail
);

authRouter.post(
	"/forgot-password",
	validateRequest(forgotPassword_Validator),
	controller.forgotPassword
);

authRouter.post(
	"/reset-password",
	validateRequest(resetPassword_Validator),
	controller.resetPassword
);

authRouter.post(
	"/change-password",
	auth,
	validateRequest(changePassword_Validator),
	controller.changePassword
);


export default authRouter;
