import z from "zod";
import mongoose from "mongoose";

const createSubCategorySchema = {
	body: z
		.object({
			name: z.string().min(3).max(32),
			category: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
		})
		.strict(),
};

const subCategoryIdSchema = {
	params: z
		.object({
			id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
		})
		.strict(),
};

const getSubCategoriesSchema = {
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

const updateSubCategorySchema = {
	body: createSubCategorySchema.body.partial().strip(),
};

export const createSubCategoryValidator = z
	.object({ ...createSubCategorySchema })
	.strip();

export const subCategoryIdValidator = z.object({ ...subCategoryIdSchema }).strip();

export const getSubCategoriesValidator = z.object({ ...getSubCategoriesSchema }).strip();

export const updateSubCategoryValidator = z
	.object({ ...subCategoryIdSchema, ...updateSubCategorySchema })
	.strip();
