import { Router } from "express";
import * as controller from "../../controllers/coupon.controller.js";
import * as schema from "../../validations/coupon.validation.js";
import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validation.js";

const couponRouter = Router();

couponRouter
	.route("/")
	.get(auth, validateRequest(schema.getCouponsValidator), controller.getCoupons)
	.post(auth, validateRequest(schema.createCouponValidator), controller.createCoupon);

couponRouter
	.route("/:id")
	.get(auth, validateRequest(schema.couponIdValidator), controller.getCouponById)
	.patch(auth, validateRequest(schema.updateCouponValidator), controller.updateCoupon)
	.delete(auth, validateRequest(schema.couponIdValidator), controller.deleteCoupon);

export default couponRouter;
