import ErrorResponse from "./FailedResponse.class.js";

export default class ConflictResponse extends ErrorResponse {
	constructor(req, err) {
		super([], req);
		this.statusCode = ConflictResponse.STATUS_CODE().CONFLICT;
		this.message = ConflictResponse.ERROR_MESSAGES().CONFILCT;
		if (err && err.message) this.message = err.message;
	}
}
