import {
	createOne,
	deleteOne,
	retriveAll,
	retriveOne,
	updateOne,
} from "../utils/factoryHandlers.js";
import Review from "../models/review.model.js";
export const setProductIdAndUserIdToBody = (req, res, next) => {
	if (!req.body.product) req.body.product = req.params.productId;
	if (!req.body.user) req.body.user = req.user._id.toString();
	next();
};

export const createReview = createOne(Review);

export const getReviews = retriveAll(Review, "Review");

export const getReviewById = retriveOne(Review);

export const updateReview = updateOne(Review);

export const deleteReview = deleteOne(Review);
