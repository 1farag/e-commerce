import { asyncHandler } from "../middleware/errorHandling.js";
import {
	googleSignIn,
	registerServiece,
	signInServiece,
} from "../services/auth.services.js";
import { CreatedResponse } from "../utils/response/response.index.js";

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
