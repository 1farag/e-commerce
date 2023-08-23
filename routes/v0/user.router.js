import { Router } from "express";
import * as controller from "../../controllers/user.controller.js";
import { auth } from "../../middleware/auth.js";
import accessFile from "../../middleware/multer.js";
import { validateRequest } from "../../middleware/validation.js";
import * as schema from "../../validations/user.validation.js";

const userRouter = Router();

userRouter
	.route("/profile")
	.get(auth, controller.getProfile)
	.put(validateRequest(schema.updateUserValidator), controller.updateProfile)
	.delete(auth, controller.deleteUser);

userRouter
	.route("/profile/picture")
	.patch(auth, accessFile("image").single("picture"), controller.updateProfilePicture)
	.delete(auth, controller.deleteProfilePicture);

userRouter
	.route("/:userId")
	.get(auth, validateRequest(schema.getUserByIdValidator), controller.getProfileById)
	.delete(auth, validateRequest(schema.getUserByIdValidator), controller.deleteUserById);




export default userRouter;