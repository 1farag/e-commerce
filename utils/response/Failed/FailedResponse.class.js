/** @format */

import APIResponse from "../APIResponse.class.js";

export default class ErrorResponse extends APIResponse {
	static ERROR_MESSAGES() {
		return {
			FAILED_CREATE: "failed to create",
			FAILED_UPDATE: "failed to update",
			FAILED_DELETE: "failed to delete",
			FAILED_RESTORE: "failed to restore",
			FAILED_ADD: "failed to add",
			FAILED_RETRIVE: "failed to retrive",
			FAILED_SEARCH: "failed to search",
			NOT_FOUND: "not found",
			BAD_REQUEST: "bad request",
			UNAUTHORIZED: "unauthorized",
			CONFILCT: "conflict",
			FORBIDDEN: "forbidden",
			NOT_ACCEPTABLE: "not acceptable",
			INTERNAL_SERVER_ERROR: "internal server error",
		};
	}
	static STATUS_CODE() {
		return {
			BAD_REQUEST: 400,
			UNAUTHORIZED: 401,
			FORBIDDEN: 403,
			NOT_FOUND: 404,
			NOT_ACCEPTABLE: 406,
			CONFLICT: 409,
			INTERNAL_SERVER_ERROR: 500,
		};
	}
	constructor(data, req, message) {
		super(ErrorResponse.STATUS_CODE.BAD_REQUEST, data, false, req, message);
		this.statusCode = ErrorResponse.STATUS_CODE().INTERNAL_SERVER_ERROR;
		this.message = ErrorResponse.ERROR_MESSAGES().INTERNAL_SERVER_ERROR;
		this.size = 0;
	}
}
