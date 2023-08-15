import { asyncHandler } from "../middleware/errorHandling.js";
import {
	deleteProfilePictureDB,
	getProfileByIdDB,
	updateProfileDB,
	updateProfilePictureDB,
} from "../services/user.services.js";
import { UpdatedResponse } from "../utils/response/response.index.js";

export const updateProfilePicture = asyncHandler(async (req, res) => {
	const result = await updateProfilePictureDB(req);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const deleteProfilePicture = asyncHandler(async (req, res) => {
	const result = await deleteProfilePictureDB(req);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const updateProfile = asyncHandler(async (req, res) => {
	const result = await updateProfileDB(req);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const getProfile = asyncHandler(async (req, res) => {
	const result = await getProfileByIdDB(req.user._id);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const getProfileById = asyncHandler(async (req, res) => {
	const result = await getProfileByIdDB(req.params.userId);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

