import User from "../models/user.model.js";
import {
	DocumentDoesNotExist,
	EmailAlreadyVerified,
	InvalidToken,
} from "../utils/errors.js";
import { deleteFile, getSignedUrlForUpload } from "../utils/s3Functions.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

export const updateProfilePictureDB = async (req) => {
	let key;
	// use mongoose transaction to update and delete old profile picture
	const session = await User.startSession();
	session.startTransaction();

	const user = await User.findById(req.user._id).session(session);
	if (!user) throw new DocumentDoesNotExist();

	if (user.profilePicture) {
		const oldProfilePicture = user.profilePicture;
		// upload new profile picture
		key = await getSignedUrlForUpload(req);
		// update user profile picture
		user.profilePicture = key;
		// delete old profile picture
		await deleteFile(oldProfilePicture);
	} else {
		key = await getSignedUrlForUpload(req);
		user.profilePicture = key;
	}

	await user.save();
	await session.commitTransaction();
	session.endSession();
	return user;
};

export const deleteProfilePictureDB = async (req) => {
	const user = await User.findById(req.user._id);
	const key = user.profilePicture;
	user.profilePicture = null;
	await deleteFile(key);
	await user.save();
	return user;
};

export const updateProfileDB = async (req) => {
	const { firstName, lastName } = req.body;
	const user = await User.findByIdAndUpdate(
		{
			_id: req.user._id,
		},
		{
			firstName,
			lastName,
		},
		{
			new: true,
		}
	).exec();
	return user;
};

export const getProfileByIdDB = async (userId) => {
	const user = await User.findById(userId).select("-password").exec();
	if (!user) throw new DocumentDoesNotExist();
	return user;
};

export const updateEmailDB = async (req) => {
	const { newEmail } = req.body;

	const user = await User.findById(req.user._id);

	if (!user) throw new DocumentDoesNotExist();

	user.pendingEmail = newEmail;

	const token = await user.generateEmailToken();

	const url = `${req.protocol}://${req.headers.host}/api/v0/user/verify-email/${token}`;

	const resending = `${req.protocol}://${req.headers.host}/api/v0/user/resend-email-verification/${user._id}`;

	const message = `Please click on the link below to verify your email address:
	 \n\n ${url} \n\n If you did not request this, please ignore this email and your password will remain unchanged.
	  \n\n If you want to resend the email verification link, please click on the link below: \n\n ${resending}`;

	await sendEmail({
		email: newEmail,
		subject: "Email verification token",
		message,
	});
};

export const verifyNewEmailDB = async (req) => {
	const { token } = req.params;

	const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

	if (!decoded) throw new InvalidToken();

	const user = await User.findById(decoded.id);

	if (!user) throw new DocumentDoesNotExist();

	user.email = user.pendingEmail;
	user.pendingEmail = undefined;

	await user.save();

	return user;
};

export const refreshEmailDB = async (req) => {
	const { userId } = req.params;
	const user = await User.findById(userId);
	if (!user) throw new DocumentDoesNotExist();
	if (!user.pendingEmail) throw EmailAlreadyVerified();
	const token = await user.generateEmailToken();

	const url = `${req.protocol}://${req.headers.host}/api/v0/user/verify-email/${token}`;

	await sendEmail({
		email: user.pendingEmail,
		subject: "Email verification token",
		message: `Please click on the link below to verify your email address: \n\n ${url}`,
	});
	return "Email sent successfully";
};