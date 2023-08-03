import User from "../models/user.model.js";
import { getSignedUrlForUpload } from "../utils/s3Functions.js";

export const addProfilePictureDB = async (req) => {
	const key = await getSignedUrlForUpload(req);
	const user = await User.findByIdAndUpdate(
		{
			_id: req.user._id,
		},
		{
			profilePicture: key,
		},
		{
			new: true,
		}
	).exec();

	return user;
};
