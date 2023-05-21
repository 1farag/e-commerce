/** @format */

import { z } from "zod";

const responseZodSchema = z
	.object({
		success: z.boolean(),
		httpMethod: z.string(),
		statusCode: z.number(),
		data: z.object({}).catchall(z.any()).array(),
		message: z.string(),
		totalPages: z.number().optional(),
		page: z.number().optional(),
		size: z.number().optional(),
		errors: z.object({}).catchall(z.string()).optional(),
	})
	.strip();

export default class APIResponse {
	static ACTION_METHODS() {
		return {
			DELETE: "deleting",
			POST: "creating",
			PUT: "updating",
			PATCH: "updating",
			GET: "retriving",
		};
	}

	constructor(statusCode, data, success, req, message) {
		let page;
		let size;

		const normalisedData = data.map((item) => {
			const values = Object.assign({}, item);
			return values;
		});

		// handle Page And Size
		if (req.query) {
			page = parseInt(req.query.page);
			size = parseInt(req.query.size);
		}
		if (!req.httpMethod == "GET" || normalisedData.length >= 0) {
			page = 1;
			size = 1;
		}

		this.statusCode = statusCode;
		this.data = normalisedData;
		this.totalPages = 1;
		this.success = success;
		this.action = APIResponse.ACTION_METHODS()[req.method];
		this.httpMethod = req.method;
		this.req = req;
		this.page = page ? parseInt(page) : 1;
		this.size = size ? parseInt(size) : 5;
		if (message) this.message = message;
	}

	getResponseJSON() {
		return responseZodSchema.parse(this);
	}
}
