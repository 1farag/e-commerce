import { Router } from "express";
import * as controller from "../../controllers/auth.controllers.js";
import { validateRequest } from "../../middleware/validation.js";
import * as schema from "../../validations/auth.validation.js";
import clientAuth from "../../utils/clientAuthReq.js";
import { auth } from "../../middleware/auth.js";
import { getUserByIdValidator } from "../../validations/user.validation.js";

const authRouter = Router();

authRouter.get("/authClient", clientAuth);

authRouter.post(
	"/google",
	validateRequest(schema.googleSignIn_Validator),
	controller.signInByGoogle
);

authRouter.post("/signup", validateRequest(schema.signup_Validator), controller.register);

authRouter.post(
	"/signin",
	validateRequest(schema.signin_Validator),
	controller.signInByEmail
);

authRouter.post("/signout", auth, controller.logout);

// verify email
authRouter.get(
	"/verify-email/:token",
	auth,
	validateRequest(schema.verifyEmailValidator),
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
	validateRequest(schema.forgotPassword_Validator),
	controller.forgotPassword
);

authRouter.post(
	"/reset-password",
	validateRequest(schema.resetPassword_Validator),
	controller.resetPassword
);

authRouter.post(
	"/change-password",
	auth,
	validateRequest(schema.changePassword_Validator),
	controller.changePassword
);


export default authRouter;
