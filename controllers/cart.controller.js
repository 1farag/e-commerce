import { asyncHandler } from "../middleware/errorHandling.js";
import {
	addToCartDB,
	applyCouponToCartDB,
	clearCartDB,
	getCartDB,
	removeItemFromCartDB,
	updateItemInCartDB,
} from "../services/cart.services.js";
import {
	DeletedResopnse,
	RetrivedResponse,
	UpdatedResponse,
} from "../utils/response/response.index.js";

export const addToCart = asyncHandler(async (req, res, next) => {
	const result = await addToCartDB(req.body.cartItems, req.user._id);
	const response = new UpdatedResponse([result], req, "successfully added to cart");
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const updateItemInCart = asyncHandler(async (req, res, next) => {
	const { product, quantity } = req.body;
	const result = await updateItemInCartDB(product, quantity, req.user._id);
	const response = new UpdatedResponse([result], req, "successfully updated cart");
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const getCartForloggedUser = asyncHandler(async (req, res, next) => {
	const result = await getCartDB(req.user._id);
	const response = new RetrivedResponse([result], req, "successfully retrived cart");
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const clearCartForloggedUser = asyncHandler(async (req, res, next) => {
	await clearCartDB(req.user._id);
	const response = new DeletedResopnse([], req, "successfully cleared cart");
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const removeItemFromCart = asyncHandler(async (req, res, next) => {
	const result = await removeItemFromCartDB(req.body.product, req.user._id);
	const response = new DeletedResopnse(
		[result],
		req,
		"successfully removed item from cart"
	);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const applyCouponToCart = asyncHandler(async (req, res, next) => {
	const result = await applyCouponToCartDB(req.body.coupon, req.user._id);
	const response = new UpdatedResponse(
		[result],
		req,
		"successfully applied coupon to cart"
	);
	res.status(response.statusCode).json(response.getResponseJSON());
});
