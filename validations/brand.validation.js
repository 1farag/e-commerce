import mongoose from "mongoose";
import z from "zod";

const createBrandSchema = {
	body: z
		.object({
			name: z.string().min(3).max(255),
		})
		.strict(),
};

const brandIdSchema = {
	params: z.object({
		id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
	}),
};

const getBrandsSchema = {
	query: z.object({
		sort: z.string().optional(),
		limit: z.number().optional(),
		skip: z.number().optional(),
		search: z.string().optional(),
		fields: z.string().optional(),
		confirmed: z.string().optional(),
	}),
};

const updateBrandSchema = {
	body: z.object({
		name: z.string().min(3).max(255),
	}),
};

export const createBrandValidator = z.object({ ...createBrandSchema }).strip();
export const brandIdValidator = z.object({ ...brandIdSchema }).strip();
export const getBrandsValidator = z.object({ ...getBrandsSchema }).strip();
export const updateBrandValidator = z
	.object({ ...brandIdSchema, ...updateBrandSchema })
	.strip();
