import {
	AuthenticationError,
	BlackListError,
	DocumentDoesNotExist,
	InvalidHeaderToken,
	RouteNotFound,
	TokenIsBlocked,
} from "../utils/errors.js";
import InternalServerResponse from "../utils/response/Failed/InternalServerErrorResponse.class.js";
import NotFoundRouteResponse from "../utils/response/Failed/NotFoundRouteResponse.class.js";
import {
	ForbiddenResponse,
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
	else if (err instanceof RouteNotFound) response = new NotFoundRouteResponse(req, err);
	else if (err instanceof AuthenticationError || err instanceof InvalidHeaderToken)
		response = new UnauthorizedResponse(req, err);
	else if (err instanceof BlackListError || err instanceof TokenIsBlocked)
		res = new ForbiddenResponse(req, err);
	else response = new InternalServerResponse(req, err);

	if (process.env.MOOD == "DEV") {
		return res.status(response.statusCode || 500).json(response.getResponseJSON());
	}

	return res.status(response.statusCode).json(response.getResponseJSON());
};
