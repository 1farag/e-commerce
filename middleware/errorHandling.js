import {
	AuthenticationError,
	BlackListError,
	DocumentDoesNotExist,
	InvalidHeaderToken,
	TokenIsBlocked,
} from "../utils/errors.js";
import {
	NotFoundResponse,
	UnauthorizedResponse,
} from "../utils/response/response.index.js";

export const asyncHandler = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch((err) => {
			next(err);
		});
	};
};

export const globalErrorHandling = (err, req, res, next) => {
	let response;
	if (err instanceof DocumentDoesNotExist) response = new NotFoundResponse(req, err);

	if (err instanceof AuthenticationError || err instanceof InvalidHeaderToken)
		response = new UnauthorizedResponse(req, err);

	if (err instanceof BlackListError || err instanceof TokenIsBlocked)
		if (process.env.MOOD == "DEV") {
			return res.status(response.statusCode || 500).json(response.getResponseJSON());
		}

	return res.status(response.statusCode).json(response.getResponseJSON());
};
