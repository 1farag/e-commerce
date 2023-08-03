import { asyncHandler } from "../middleware/errorHandling.js";
import { addProfilePictureDB } from "../services/user.services.js";
import { UpdatedResponse } from "../utils/response/response.index.js";

export const addProfilePicture = asyncHandler(async (req, res) => {
	const result = await addProfilePictureDB(req);
	const response = new UpdatedResponse([result], req);
	res.status(response.statusCode).json(response.getResponseJSON());
});
