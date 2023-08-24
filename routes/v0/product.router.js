import { Router } from "express";

import * as controller from "../../controllers/product.controller.js";

import * as schema from "../../validations/product.validation.js";

import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validation.js";
import { setUserId } from "../../controllers/product.controller.js";
import accessFile from "../../middleware/multer.js";
import reviewRouter from "./review.router.js";
const productRouter = Router();
productRouter.use("/:productId/reviews", reviewRouter);
productRouter
	.route("/")
	.get(validateRequest(schema.getProductsValidator), controller.getProducts)
	.post(
		auth,
		accessFile("image").fields([
			{ name: "imageCover", maxCount: 1 },
			{ name: "images", maxCount: 10 },
		]),
		setUserId,
		controller.createProduct
	);

productRouter
	.route("/:id")
	.get(validateRequest(schema.productIdValidator), controller.getProductById)
	.put(validateRequest(schema.updateProductValidator), controller.updateProduct)
	.delete(validateRequest(schema.productIdValidator), controller.deleteProduct);

export default productRouter;
