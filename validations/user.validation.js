import mongoose from "mongoose";
import z from "zod";

const updateUserSchema = {
	body: z
		.object({
			firstName: z.string().min(3).max(255).optional(),
			lastName: z.string().min(3).max(255).optional(),
			newEmail: z.string().email().min(3).max(255),
		})
		.strip(),
};

const getUserByIdSchema = {
	params: z
		.object({
			userId: z
				.string()
				.refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid user id"),
		})
		.strip(),
};

export const updateUserValidator = z.object({ ...updateUserSchema }).strip();
export const getUserByIdValidator = z.object({ ...getUserByIdSchema }).strip();
