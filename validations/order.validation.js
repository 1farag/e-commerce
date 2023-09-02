import z from "zod";
import mongoose from "mongoose";

const createOrderSchema = {
	body: z
		.object({
			shippingAddress: z
				.object({
					addressLine1: z.string(),
					addressLine2: z.string(),
					city: z.string(),
					state: z.string(),
					country: z.string(),
					postalCode: z.string(),
				})
				.optional(),
			paymentMethod: z.string().refine((data) => {
				return data === "cash" || data === "stripe";
			}),
			orderNote: z.string(),
		})
		.strict(),
};

const updateOrderSchema = {
	body: z
		.object({
			orderStatus: z.string().refine((data) => {
				return (
					data === "pending" ||
					data === "processing" ||
					data === "paid" ||
					data === "shipped" ||
					data === "delivered" ||
					data === "cancelled"
				);
			}),
		})
		.strict(),
};

const orderIdSchema = {
	params: z
		.object({
			id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
		})
		.strict(),
};

export const createOrderValidator = z.object({ ...createOrderSchema }).strip();

export const updateOrderValidator = z
	.object({ ...orderIdSchema, ...updateOrderSchema })
	.strip();

export const orderIdValidator = z.object({ ...orderIdSchema }).strip();
