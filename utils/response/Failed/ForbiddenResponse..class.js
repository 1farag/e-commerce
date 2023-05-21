import ErrorResponse from "./FailedResponse.class.js";

export default class ForbiddenResponse extends ErrorResponse {
	constructor(req, err) {
		super([], req);
		this.statusCode = ForbiddenResponse.STATUS_CODE().FORBIDDEN;
		this.message = ForbiddenResponse.ERROR_MESSAGES().FORBIDDEN;
		if (err && err.message) this.message = err.message;
	}
}
