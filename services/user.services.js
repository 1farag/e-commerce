import User from "../models/user.model.js";
import { DocumentDoesNotExist, FailedToDelete, FailedToUpload } from "../utils/errors.js";
import { deleteFile, getSignedUrlForUpload } from "../utils/s3Functions.js";

export const getProfileByIdDB = async (userId) => {
	const user = await User.findById(userId).select("-password").exec();
	if (!user) throw new DocumentDoesNotExist();
	return user;
};

export const updateProfilePictureDB = async (req) => {
	let key;
	// use mongoose transaction to update and delete old profile picture
	const session = await User.startSession();
	session.startTransaction();
	try {
		const user = await User.findById(req.user._id).session(session);
		if (!user) throw new DocumentDoesNotExist();

		if (user.profilePicture) {
			const oldProfilePicture = user.profilePicture;
			// upload new profile picture
			key = await getSignedUrlForUpload(req, "profile-pictures");
			// update user profile picture
			user.profilePicture = key;
			// delete old profile picture
			await deleteFile(oldProfilePicture);
		} else {
			key = await getSignedUrlForUpload(req, "profile-pictures");
			user.profilePicture = key;
		}
		await user.save();
		await session.commitTransaction();
		return user;
	} catch (error) {
		await session.abortTransaction();
		throw new FailedToUpload(error);
	} finally {
		session.endSession();
	}
};

export const updateProfileDB = async (req) => {
	const { firstName, lastName, newEmail } = req.body;

	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			firstName,
			lastName,
			email: newEmail,
		},
		{
			new: true,
		}
	).exec();

	return user;
};

export const deleteProfilePictureDB = async (req) => {
	const session = await User.startSession();

	try {
		session.startTransaction();
		const user = await User.findById(req.user._id).session(session);

		if (!user) throw new DocumentDoesNotExist();
		if (!user.profilePicture) throw new DocumentDoesNotExist("profile picture");

		const oldProfilePicture = user.profilePicture;
		user.profilePicture = undefined;

		await user.save();
		await deleteFile(oldProfilePicture);

		await session.commitTransaction();

		return user;
	} catch (error) {
		await session.abortTransaction();
		throw new FailedToDelete(error);
	} finally {
		session.endSession();
	}
};
