import { z } from "zod";
const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);

const signupSchema = {
	body: z
		.object({
			firstName: z
				.string({
					invalid_type_error: "first name should be string",
					required_error: "first name is required",
				})
				.trim()
				.min(2)
				.max(20)
				.toLowerCase(),
			lastName: z
				.string({
					invalid_type_error: "last name should be string",
					required_error: "last name is required",
				})
				.trim()
				.min(2)
				.max(20)
				.toLowerCase(),
			email: z
				.string({
					invalid_type_error: "email should be string",
					required_error: "email is required",
				})
				.trim()
				.email({ message: "Invalid email address" })
				.toLowerCase(),
			password: z.string().min(8).max(50).regex(passwordRegex),
			confirmPassword: z.string().min(8).max(50).regex(passwordRegex),
		})
		.strict()
		.refine((data) => data.confirmPassword === data.password, {
			message: "The passwords did not match",
		}),
};
const signinSchema = {
	password: z.string().min(8).max(50).regex(passwordRegex),
	email: z
		.string({
			invalid_type_error: "email should be string",
			required_error: "email is required",
		})
		.trim()
		.email({ message: "Invalid email address" })
		.toLowerCase(),
};
const googleSignInSchema = {
	query: z.object({
		code: z.string().trim(),
	}),
};
export const signup_Validator = z
	.object({
		...signupSchema,
	})
	.strict();

export const signin_Validator = z
	.object({
		...signinSchema,
	})
	.strict();

export const googleSignIn_Validator = z
	.object({
		...googleSignInSchema,
	})
	.strict();
