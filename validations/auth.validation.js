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
		.refine((data) => data.confirmPassword === data.password, {
			message: "The passwords did not match",
		}),
};

const signinSchema = {
	body: z
		.object({
			password: z.string().min(8).max(50).regex(passwordRegex),
			email: z
				.string({
					invalid_type_error: "email should be string",
					required_error: "email is required",
				})
				.trim()
				.email({ message: "Invalid email address" })
				.toLowerCase(),
		})
		.strip(),
};

const googleSignInSchema = {
	query: z.object({
		code: z.string().trim(),
	}),
};

const verifyEmailSchema = {
	params: z.object({
		token: z.string().min(3).max(255),
	}),
};

const forgotPasswordSchema = {
	body: z.object({
		email: z.string().email({ message: "Invalid email address" }).trim(),
	}),
};

const resetPasswordSchema = {
	body: z.object({
		OTP: z.string().min(3).max(255),
		password: z.string().min(8).max(50).regex(passwordRegex),
		confirmPassword: z.string().min(8).max(50).regex(passwordRegex),
	}),
};

const changePasswordSchema = {
	body: z.object({
		oldPassword: z.string().min(8).max(50).regex(passwordRegex),
		newPassword: z.string().min(8).max(50).regex(passwordRegex),
		confirmPassword: z.string().min(8).max(50).regex(passwordRegex),
	}),
};

export const changePassword_Validator = z.object({ ...changePasswordSchema }).strip();
export const resetPassword_Validator = z.object({ ...resetPasswordSchema }).strip();
export const forgotPassword_Validator = z.object({ ...forgotPasswordSchema }).strip();
export const googleSignIn_Validator = z.object({ ...googleSignInSchema }).strip();
export const signup_Validator = z.object({ ...signupSchema }).strip();
export const verifyEmailValidator = z.object({ ...verifyEmailSchema }).strip();
export const signin_Validator = z.object({ ...signinSchema }).strip();
