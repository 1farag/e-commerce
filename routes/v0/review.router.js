import { Router } from "express";

import * as controller from "../../controllers/review.controller.js";
import * as schmea from "../../validations/review.validation.js";
import { validateRequest } from "../../middleware/validation.js";

import { auth } from "../../middleware/auth.js";
const reviewRouter = Router({
	mergeParams: true,
});

reviewRouter
	.route("/")
	.get(validateRequest(schmea.getReviewsValidator), controller.getReviews)
	.post(
		auth,
		controller.setProductIdAndUserIdToBody,
		validateRequest(schmea.createReviewValidator),
		controller.createReview
	);

reviewRouter
	.route("/:id")
	.get(validateRequest(schmea.reviewIdValidator), controller.getReviewById)
	.put(auth, validateRequest(schmea.updateReviewValidator), controller.updateReview)
	.delete(validateRequest(schmea.reviewIdValidator), auth, controller.deleteReview);

export default reviewRouter;
