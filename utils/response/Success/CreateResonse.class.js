import SuccessResponse from "./SuccessResponse.class.js";

export default class CreatedResponse extends SuccessResponse {
	constructor(data, req, message) {
		super(data, req, message);
		this.statusCode = CreatedResponse.STATUS_CODE().CREATED;
		this.message = message || CreatedResponse.SUCCESS_MESSAGES().CREATED;
		this.size = 1;
		this.page = 1;
	}
}
