import { asyncHandler } from "../middleware/errorHandling.js";
import { registerServiece } from "../services/auth.services.js";
import { CreatedResponse } from "../utils/response/response.index.js";

export const register = asyncHandler(async (req, res) => {
	const result = await registerServiece(req);
	const response = new CreatedResponse([result], req);
	res.status(response.statusCode).send(response.getResponseJSON());
});


