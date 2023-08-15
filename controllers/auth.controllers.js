import { asyncHandler } from "../middleware/errorHandling.js";
import {
	changePasswordDB,
	forgetPasswordDB,
	forgetPasswordVerificationDB,
	googleSignIn,
	logoutDB,
	refreshEmailDB,
	registerServiece,
	signInServiece,
	verifyNewEmailDB,
} from "../services/auth.services.js";
import { CreatedResponse, UpdatedResponse } from "../utils/response/response.index.js";

export const register = asyncHandler(async (req, res) => {
	const result = await registerServiece(req);
	const response = new CreatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const signInByEmail = asyncHandler(async (req, res) => {
	const result = await signInServiece(req);
	const response = new CreatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const signInByGoogle = asyncHandler(async (req, res) => {
	const result = await googleSignIn(req);
	const response = new CreatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const logout = asyncHandler(async (req, res) => {
	await logoutDB(req);
	const response = new UpdatedResponse([], req, "Logout successfully");
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const verifyEmail = asyncHandler(async (req, res) => {
	const result = await verifyNewEmailDB(req);
	const response = new UpdatedResponse([result], req, "Email verified");
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const refreshEmail = asyncHandler(async (req, res) => {
	await refreshEmailDB(req);
	const response = new UpdatedResponse([], req, "Email refreshed");
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const forgotPassword = asyncHandler(async (req, res) => {
	await forgetPasswordDB(req);
	const response = new UpdatedResponse(
		[],
		req,
		"check your email for reset password OTP"
	);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const resetPassword = asyncHandler(async (req, res) => {
	await forgetPasswordVerificationDB(req);
	const response = new UpdatedResponse(
		[],
		req,
		"Password reset successfully, login to continue"
	);
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const changePassword = asyncHandler(async (req, res) => {
	await changePasswordDB(req);
	const response = new UpdatedResponse([], req, "Password changed successfully");
	res.status(response.statusCode).json(response.getResponseJSON());
});
