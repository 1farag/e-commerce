import { Router } from "express";
import * as controller from "../../controllers/user.controller.js";
import { auth } from "../../middleware/auth.js";
import accessFile from "../../middleware/multer.js";
import { validateRequest } from "../../middleware/validation.js";
import {
	getUserByIdValidator,
	updateEmailValidator,
	updateUserValidator,
	verifyEmailValidator,
} from "../../validations/user.validation.js";

const userRouter = Router();

userRouter.route("/profile").get(auth, controller.getProfile);

userRouter
	.route("/profile-picture")
	.patch(auth, accessFile("image").single("picture"), controller.updateProfilePicture)
	.put(validateRequest(updateUserValidator), controller.updateProfile)
	.delete(auth, controller.deleteProfilePicture);

userRouter
	.route("/:userId")
	.get(auth, validateRequest(getUserByIdValidator), controller.getProfileById);

// update email
userRouter.put(
	"/update-email",
	auth,
	validateRequest(updateEmailValidator),
	controller.updateEmail
);

// verify email
userRouter.get(
	"/verify-email/:token",
	auth,
	validateRequest(verifyEmailValidator),
	controller.verifyNewEmail
);

// refresh email
userRouter.get(
	"/resend-email-verification/:userId",
	validateRequest(getUserByIdValidator),
	controller.refreshEmail
);

export default userRouter;