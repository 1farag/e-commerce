import SuccessResponse from "./SuccessResponse.class.js";

export default class RetrivedResponse extends SuccessResponse {
	constructor(data, req, message) {
		super(data, req, message);
		if (data instanceof Array) {
			if (data.length == 0) {
				if (data[0].token) data = Object.assign({}, data[0]);
				this.size = 0;
			}
		}
		this.message = message || RetrivedResponse.SUCCESS_MESSAGES().RETRIVED;
	}
}
