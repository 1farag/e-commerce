import ErrorResponse from "./FailedResponse.class.js";

export default class InternalServerResponse extends ErrorResponse {
	constructor(req, err) {
		super([], req);
		this.statusCode = InternalServerResponse.STATUS_CODE().INTERNAL_SERVER_ERROR;
		this.message = InternalServerResponse.ERROR_MESSAGES().INTERNAL_SERVER_ERROR;
		if (err && err.message) this.message = err.message;
	}
}
