import SuccessResponse from "./SuccessResponse.class.js";

export default class UpdatedResponse extends SuccessResponse {
	constructor(data, req, message) {
		super(data, req, message);
		this.statusCode = UpdatedResponse.STATUS_CODE().OK;
		this.message = message || UpdatedResponse.SUCCESS_MESSAGES().UPDATED;
	}
}
