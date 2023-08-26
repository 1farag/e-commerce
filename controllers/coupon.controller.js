import {
	createOne,
	deleteOne,
	retriveAll,
	retriveOne,
	updateOne,
} from "../utils/factoryHandlers.js";

import Coupon from "../models/coupon.model.js";

export const createCoupon = createOne(Coupon);

export const getCoupons = retriveAll(Coupon, "coupon");

export const getCouponById = retriveOne(Coupon);

export const updateCoupon = updateOne(Coupon);

export const deleteCoupon = deleteOne(Coupon);
