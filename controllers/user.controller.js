import { asyncHandler } from "../middleware/errorHandling.js";
import {
	addToWishlistDB,
	deleteProfilePictureDB,
	deleteUserDB,
	getProfileByIdDB,
	getWishlistDB,
	removeFromWishlistDB,
	updateProfileDB,
	updateProfilePictureDB,
} from "../services/user.services.js";
import {
	DeletedResopnse,
	RetrivedResponse,
	UpdatedResponse,
} from "../utils/response/response.index.js";

export const updateProfilePicture = asyncHandler(async (req, res) => {
	const result = await updateProfilePictureDB(req);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const deleteProfilePicture = asyncHandler(async (req, res) => {
	const result = await deleteProfilePictureDB(req);
	const response = new DeletedResopnse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const updateProfile = asyncHandler(async (req, res) => {
	const result = await updateProfileDB(req);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const getProfile = asyncHandler(async (req, res) => {
	const result = await getProfileByIdDB(req.user._id);
	const response = new RetrivedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const getProfileById = asyncHandler(async (req, res) => {
	const result = await getProfileByIdDB(req.params.userId);
	const response = new RetrivedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const deleteUser = asyncHandler(async (req, res) => {
	await deleteUserDB(req.user._id);
	const response = new DeletedResopnse([], req, "User deleted successfully");
	res.status(response.statusCode).json(response.getResponseJSON());
});
export const deleteUserById = asyncHandler(async (req, res) => {
	await deleteUserDB(req.params.userId);
	const response = new DeletedResopnse([], req, "User deleted successfully");
	res.status(response.statusCode).json(response.getResponseJSON());
});

// wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
	const result = await addToWishlistDB(req.body.productId, req.user._id);
	const response = new UpdatedResponse([result], req, "successfully added to wishlist");
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const getWishlist = asyncHandler(async (req, res) => {
	const result = await getWishlistDB(req.user._id);
	const response = new RetrivedResponse(result.wishlist, req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
	const result = await removeFromWishlistDB(req.body.productId, req.user._id);
	const response = new DeletedResopnse(
		result.wishlist,
		req,
		"successfully deleted from wishlist"
	);
	res.status(response.statusCode).json(response.getResponseJSON());
});