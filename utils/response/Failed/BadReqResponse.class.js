import ErrorResponse from "./FailedResponse.class.js";

export default class BadReqResponse extends ErrorResponse {
	constructor(req, err) {
		super([], req);
		this.statusCode = BadReqResponse.STATUS_CODE().BAD_REQUEST;
		this.message = BadReqResponse.ERROR_MESSAGES().BAD_REQUEST;
		if (err && err.message) this.message = err.message;
	}
}
