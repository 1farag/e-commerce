import { Router } from "express";
import * as controller from "../../controllers/brand.controller.js";
import * as schema from "../../validations/brand.validation.js";
import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validation.js";

const brandRouter = Router();

brandRouter
	.route("/")
	.get(validateRequest(schema.getBrandsValidator), controller.getBrands)
	.post(auth, validateRequest(schema.createBrandValidator), controller.createBrand);

brandRouter
	.route("/:id")
	.get(validateRequest(schema.brandIdValidator), controller.getBrandById)
	.patch(auth, validateRequest(schema.updateBrandValidator), controller.updateBrand)
	.delete(auth, validateRequest(schema.brandIdValidator), controller.deleteBrand);

export default brandRouter;
