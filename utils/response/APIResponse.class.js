import { z } from "zod";

class APIResponse {
	static ACTION_METHODS = {
		DELETE: "deleting",
		POST: "creating",
		PUT: "updating",
		PATCH: "updating",
		GET: "retrieving",
	};

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
			return document;
		});
	}

	constructor(statusCode, data, success, req, message) {
		this.statusCode = statusCode;
		this.success = success;
		this.action = APIResponse.ACTION_METHODS[req.method];
		this.httpMethod = req.method;
		this.req = req;
		this.message = message;
		this.page = 1;
		this.data = this.normalizeData(data);
		this.size = data.length;
		this.totalPages = 1;
	}

	getResponseJSON() {
		return APIResponse.responseZodSchema.parse(this);
	}
}

export default APIResponse;
