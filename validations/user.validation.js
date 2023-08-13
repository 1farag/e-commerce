import z from "zod";

const updateUserSchema = {
	body: z
		.object({
			firstName: z.string().min(3).max(255).optional(),
			lastName: z.string().min(3).max(255).optional(),
		})
		.strip(),
};

const updateEmailSchema = {
	Body: z
		.object({
			newEmail: z.string().email().min(3).max(255),
		})
		.strip(),
};

const getUserByIdSchema = {
	params: z
		.object({
			userId: z.string().min(3).max(255),
		})
		.strip(),
};

const verifyEmailSchema = {
	params: z.object({
		token: z.string().min(3).max(255),
	}),
};

export const updateUserValidator = z.object({ ...updateUserSchema }).strip();
export const updateEmailValidator = z.object({ ...updateEmailSchema }).strip();
export const getUserByIdValidator = z.object({ ...getUserByIdSchema }).strip();
export const verifyEmailValidator = z.object({ ...verifyEmailSchema }).strip();
