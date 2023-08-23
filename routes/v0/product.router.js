import { Router } from "express";

import * as controller from "../../controllers/product.controller.js";

import * as schema from "../../validations/product.validation.js";

import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validation.js";
import { setUserId } from "../../controllers/product.controller.js";

const productRouter = Router();

productRouter
	.route("/")
	.get(validateRequest(schema.getProductsValidator), controller.getProducts)
	.post(
		auth,
		validateRequest(schema.createProductValidator),
		setUserId,
		controller.createProduct
	);

productRouter
	.route("/:id")
	.get(validateRequest(schema.productIdValidator), controller.getProductById)
	.put(validateRequest(schema.updateProductValidator), controller.updateProduct)
	.delete(validateRequest(schema.productIdValidator), controller.deleteProduct);

export default productRouter;
