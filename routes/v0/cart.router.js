import express from "express";
import { auth } from "../../middleware/auth.js";

import * as controller from "../../controllers/cart.controller.js";
import * as schema from "../../validations/cart.validation.js";
import { validateRequest } from "../../middleware/validation.js";

const cartRouter = express.Router();

cartRouter.use(auth);

cartRouter
	.route("/")
	.get(controller.getCartForloggedUser)
	.post(validateRequest(schema.addItemToCartValidator), controller.addToCart)
	.patch(validateRequest(schema.updateItemInCartValidator), controller.updateItemInCart)
	.delete(
		validateRequest(schema.removeItemFromCartValidator),
		controller.removeItemFromCart
	);

cartRouter.route("/clear").delete(controller.clearCartForloggedUser);

cartRouter
	.route("/coupon")
	.post(
		validateRequest(schema.applyCouponToCartValidator),
		controller.applyCouponToCart
	);

export default cartRouter;
