import mongoose from "mongoose";
import z from "zod";

const addItemToCartSchema = {
	body: z
		.object({
			cartItems: z
				.object({
					product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
					quantity: z.number().int().min(1),
					color: z.string(),
					size: z.string(),
				})
				.strict(),
		})
		.strict(),
};

const updateItemInCartSchema = {
	body: z
		.object({
			product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
			quantity: z.number().min(1),
		})
		.strict(),
};

const removeItemFromCartSchema = {
	body: z
		.object({
			product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
		})
		.strict(),
};

const applyCouponToCartSchema = {
	body: z
		.object({
			coupon: z.string().min(3).max(255),
		})
		.strict(),
};

export const addItemToCartValidator = z.object({ ...addItemToCartSchema }).strip();

export const updateItemInCartValidator = z.object({ ...updateItemInCartSchema }).strip();

export const removeItemFromCartValidator = z
	.object({ ...removeItemFromCartSchema })
	.strip();

export const applyCouponToCartValidator = z
	.object({ ...applyCouponToCartSchema })
	.strip();
