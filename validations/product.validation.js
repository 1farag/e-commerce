import mongoose from "mongoose";
import z from "zod";

const createProductSchema = {
	body: z
		.object({
			title: z.string().min(3).max(32),
			description: z.string().min(3).max(2000),
			price: z.number().min(0).max(1000000),
			subCategory: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
			brand: z.string().min(3).max(255),
			quantity: z.number().min(0).max(1000000),
			color: z.string().min(3).max(255),
			size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
		})
		.strict(),
};

const productIdSchema = {
	params: z
		.object({
			id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
		})
		.strict(),
};

const getProductsSchema = {
	query: z
		.object({
			sort: z.string().trim().min(3).max(255).optional(),
			limit: z.number().min(1).max(255).optional(),
			skip: z.number().min(0).optional(),
			search: z.string().trim().min(3).max(255).optional(),
			confirmed: z.boolean().optional(),
		})
		.strict(),
};

const updateProductSchema = {
	body: createProductSchema.body.partial().strip(),
};

export const createProductValidator = z.object({ ...createProductSchema }).strip();
export const productIdValidator = z.object({ ...productIdSchema }).strip();
export const getProductsValidator = z.object({ ...getProductsSchema }).strip();
export const updateProductValidator = z
	.object({ ...productIdSchema, ...updateProductSchema })
	.strip();
