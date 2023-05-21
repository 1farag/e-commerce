import ErrorResponse from "./FailedResponse.class.js";

export default class NotAcceptableResponse extends ErrorResponse {
	constructor(req, err) {
		super([], req);
		this.statusCode = NotAcceptableResponse.STATUS_CODE().NOT_ACCEPTABLE;
		this.message = NotAcceptableResponse.ERROR_MESSAGES().NOT_ACCEPTABLE;
		if (err && err.message) this.message = err.message;
	}
}
