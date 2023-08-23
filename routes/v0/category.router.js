import { Router } from "express";

import * as controller from "../../controllers/category.controller.js";

import * as schema from "../../validations/category.validation.js";

import { auth } from "../../middleware/auth.js";

import { validateRequest } from "../../middleware/validation.js";

import subcategoryRouter from "./subCategory.router.js";

const categoryRouter = Router();

categoryRouter.use("/:categoryId/subcategories", subcategoryRouter);

categoryRouter
	.route("/")
	.get(validateRequest(schema.getCategoriesValidator), controller.getCategories)
	.post(
		auth,
		validateRequest(schema.createCategoryValidator),
		controller.createCategory
	);

categoryRouter
	.route("/:id")
	.get(validateRequest(schema.categoryIdValidator), controller.getCategoryById)
	.put(auth, validateRequest(schema.updateCategoryValidator), controller.updateCategory)
	.delete(auth, validateRequest(schema.categoryIdValidator), controller.deleteCategory);

export default categoryRouter;
