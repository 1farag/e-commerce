import { Router } from "express";
import * as controller from "../../controllers/user.controller.js";
import { auth } from "../../middleware/auth.js";
import accessFile from "../../middleware/multer.js";

const userRouter = Router();

userRouter.patch(
	"/profile/picture",
	auth,
	accessFile("image").single("picture"),
	controller.addProfilePicture
);

export default userRouter;
