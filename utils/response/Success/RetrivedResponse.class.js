import SuccessResponse from "./SuccessResponse.class.js";

export default class RetrivedResponse extends SuccessResponse {
	constructor(data, req, message, paginate) {
		super(data, req, message);
		if (paginate) {
			this.page = paginate.page;
			this.totalPages = paginate.totalPages;
		}
		this.statusCode = RetrivedResponse.STATUS_CODE().OK;
		this.message = message || RetrivedResponse.SUCCESS_MESSAGES().RETRIVED;
	}
}
