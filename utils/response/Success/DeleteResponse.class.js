import SuccessResponse from "./SuccessResponse.class.js";

export default class DeletedResponse extends SuccessResponse {
	constructor(data, req, message) {
		super(data, req, message);
		this.size = data.length;
		this.statusCode = DeletedResponse.STATUS_CODE().OK;
		this.message = message || DeletedResponse.SUCCESS_MESSAGES().DELETED;
	}
}
