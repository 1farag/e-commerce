import mongoose from "mongoose";
import z from "zod";

const createCouponSchema = {
	body: z
		.object({
			name: z.string().min(3).max(255),
			expire: z.coerce.date(),
			discount: z.number(),
		})
		.strict(),
};

const couponIdSchema = {
	params: z.object({
		id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
	}),
};

const getCouponsSchema = {
	query: z.object({
		sort: z.string().optional(),
		limit: z.number().optional(),
		skip: z.number().optional(),
		search: z.string().optional(),
		fields: z.string().optional(),
	}),
};

const updateCouponSchema = {
	body: createCouponSchema.body.omit({ name: true }).partial().strict(),
};

export const createCouponValidator = z.object({ ...createCouponSchema }).strip();
export const couponIdValidator = z.object({ ...couponIdSchema }).strip();
export const getCouponsValidator = z.object({ ...getCouponsSchema }).strip();
export const updateCouponValidator = z
	.object({ ...couponIdSchema, ...updateCouponSchema })
	.strip();
