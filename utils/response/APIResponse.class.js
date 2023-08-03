import { z } from "zod";
import mongoose from "mongoose";

class APIResponse {
	static ACTION_METHODS = {
		DELETE: "deleting",
		POST: "creating",
		PUT: "updating",
		PATCH: "updating",
		GET: "retrieving",
	};

	static SENSITIVE_FIELDS = [
		"password",
		"salt",
		"verificationCode",
		"passwordChangedAt",
		"googleId",
		"registeredWithGoogle",
		"__v",
	];

	static responseZodSchema = z
		.object({
			success: z.boolean(),
			httpMethod: z.string(),
			statusCode: z.number(),
			data: z.array(z.object({}).nonstrict()),
			message: z.string().optional(),
			totalPages: z.number().optional(),
			page: z.number().optional(),
			size: z.number().optional(),
			errors: z.record(z.string()).optional(),
		})
		.strip();

	normalizeData(data) {
		return data.map((document) => {
			if (document instanceof mongoose.Document) {
				return this.removeSensitiveFields(
					document.toObject({
						virtuals: true,
						versionKey: false,
					})
				);
			}
			return document;
		});
	}

	removeSensitiveFields(obj) {
		const result = { ...obj };
		for (const field of APIResponse.SENSITIVE_FIELDS) {
			delete result[field];
		}
		return result;
	}

	constructor(statusCode, data, success, req, message) {
		this.statusCode = statusCode;
		this.success = success;
		this.action = APIResponse.ACTION_METHODS[req.method];
		this.httpMethod = req.method;
		this.req = req;
		this.message = message;

		let page;
		let size;

		if (req.query) {
			page = parseInt(req.query.page);
			size = parseInt(req.query.size);
		}

		if (req.method !== "GET" || data.length === 0) {
			page = 1;
			size = 1;
		}

		this.page = page ? parseInt(page) : 1;
		this.size = size ? parseInt(size) : 5;

		this.data = this.normalizeData(data);
		this.totalPages = 1;
	}

	getResponseJSON() {
		return APIResponse.responseZodSchema.parse(this);
	}
}

export default APIResponse;
