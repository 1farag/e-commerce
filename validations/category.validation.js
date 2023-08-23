import mongoose from "mongoose";
import z from "zod";

const createCategorySchema = {
	body: z
		.object({
			name: z.string().min(3).max(32),
		})
		.strict(),
};

const categoryIdSchema = {
	params: z.object({
		id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
	}),
};

const getCategoriesSchema = {
	query: z
		.object({
			sort: z.string().optional(),
			limit: z.number().optional(),
			skip: z.number().optional(),
			search: z.string().optional(),
			fields: z.string().optional(),
		})
		.strict(),
};

const updateCategorySchema = {
	body: createCategorySchema.body.strip().partial(),
};

export const createCategoryValidator = z.object({ ...createCategorySchema }).strip();
export const categoryIdValidator = z.object({ ...categoryIdSchema }).strip();
export const getCategoriesValidator = z.object({ ...getCategoriesSchema }).strip();
export const updateCategoryValidator = z
	.object({ ...categoryIdSchema, ...updateCategorySchema })
	.strip();
