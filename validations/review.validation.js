import mongoose from "mongoose";
import z from "zod";

const createReviewSchema = {
	body: z
		.object({
			title: z.string().min(3).max(255),
			ratings: z.number().min(1).max(5),
			description: z.string().min(3).max(255),
			product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
			user: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
		})
		.strict(),
};

const reviewIdSchema = {
	params: z.object({
		id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
	}),
};

const getReviewsSchema = {
	query: z.object({
		sort: z.string().optional(),
		limit: z.number().optional(),
		skip: z.number().optional(),
		search: z.string().optional(),
		fields: z.string().optional(),
	}),
};

const updateReviewSchema = {
	body: z.object({
		title: z.string().min(3).max(255),
		ratings: z.number().min(1).max(5),
	}),
};

export const createReviewValidator = z.object({ ...createReviewSchema }).strip();
export const reviewIdValidator = z.object({ ...reviewIdSchema }).strip();
export const getReviewsValidator = z.object({ ...getReviewsSchema }).strip();
export const updateReviewValidator = z
	.object({ ...reviewIdSchema, ...updateReviewSchema })
	.strip();
