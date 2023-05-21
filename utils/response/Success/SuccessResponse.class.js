/** @format */

import APIResponse from "../APIResponse.class.js";
export default class SuccessResponse extends APIResponse {
	static SUCCESS_MESSAGES() {
		return {
			CREATED: "created successfully",
			UPDATED: "updated successfully",
			DELETED: "deleted successfully",
			RETRIVED: "retrived successfully",
			RESTORED: "restored successfully",
			ADDED: "added successfully",
		};
	}
	static STATUS_CODE() {
		return {
			OK: 200,
			CREATED: 201,
			ACCEPTED: 202,
		};
	}
	constructor(data, req, message) {
		super(SuccessResponse.STATUS_CODE().OK, data, true, req, message);
	}
}
