import { asyncHandler } from "../middleware/errorHandling.js";
import {
	deleteProfilePictureDB,
	getProfileByIdDB,
	refreshEmailDB,
	updateEmailDB,
	updateProfileDB,
	updateProfilePictureDB,
	verifyNewEmailDB,
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
// get user profile
export const getProfile = asyncHandler(async (req, res) => {
	const result = await getProfileByIdDB(req.user._id);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

// get user profile by id
export const getProfileById = asyncHandler(async (req, res) => {
	const result = await getProfileByIdDB(req.params.userId);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

// update email
export const updateEmail = asyncHandler(async (req, res) => {
	await updateEmailDB(req);
	const response = new UpdatedResponse([], req, "please check your email");
	res.status(response.statusCode).json(response.getResponseJSON());
});

// verify email
export const verifyNewEmail = asyncHandler(async (req, res) => {
	const result = await verifyNewEmailDB(req);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const refreshEmail = asyncHandler(async (req, res) => {
	await refreshEmailDB(req);
	const response = new UpdatedResponse([], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});
