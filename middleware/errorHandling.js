import multer from "multer";
import {
	AuthenticationError,
	BlackListError,
	DocumentDoesNotExist,
	EmailAlreadyVerified,
	InvalidCode,
	InvalidFileFormat,
	InvalidFileType,
	InvalidHeaderToken,
	InvalidToken,
	RouteNotFound,
	TokenExpiredError,
	TokenIsBlocked,
	UserAlreadyVerified,
	ZodError,
} from "../utils/errors.js";
import InternalServerResponse from "../utils/response/Failed/InternalServerErrorResponse.class.js";
import NotFoundRouteResponse from "../utils/response/Failed/NotFoundRouteResponse.class.js";
import {
	BadReqResponse,
	ConflictResponse,
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
	else if (
		err instanceof ZodError ||
		err instanceof InvalidFileType ||
		err instanceof InvalidFileFormat ||
		err instanceof TokenExpiredError ||
		err instanceof multer.MulterError ||
		err instanceof InvalidToken ||
		err instanceof InvalidCode
	)
		response = new BadReqResponse(req, err);
	else if (err instanceof RouteNotFound) response = new NotFoundRouteResponse(req, err);
	else if (err instanceof AuthenticationError || err instanceof InvalidHeaderToken)
		response = new UnauthorizedResponse(req, err);
	else if (err instanceof BlackListError || err instanceof TokenIsBlocked)
		res = new ForbiddenResponse(req, err);
	else if (err instanceof UserAlreadyVerified || err instanceof EmailAlreadyVerified)
		response = new ConflictResponse(req, err);
	else response = new InternalServerResponse(req, err);

	if (process.env.MOOD == "DEVELOPMENT") {
		// eslint-disable-next-line no-console
		console.log(err);
		return res.status(response.statusCode || 500).json(response.getResponseJSON());
	}
	return res.status(response.statusCode).json(response.getResponseJSON());
};
