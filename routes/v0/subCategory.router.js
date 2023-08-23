import { Router } from "express";

import * as controller from "../../controllers/subCategory.controller.js";

import * as Schema from "../../validations/subCategory.validation.js";

import { validateRequest } from "../../middleware/validation.js";

import { auth } from "../../middleware/auth.js";

const subCategoryRouter = Router({ mergeParams: true });

subCategoryRouter
	.route("/")
	.get(
		controller.filterByCategoryId,
		validateRequest(Schema.getSubCategoriesValidator),
		controller.getSubCategories
	)
	.post(
		auth,
		controller.setCategoryIdToBody,
		validateRequest(Schema.createSubCategoryValidator),
		controller.createSubCategory
	);

subCategoryRouter
	.route("/:id")
	.get(validateRequest(Schema.subCategoryIdValidator), controller.getSubCategoryById)
	.put(
		auth,
		validateRequest(Schema.updateSubCategoryValidator),
		controller.updateSubCategory
	)
	.delete(
		auth,
		validateRequest(Schema.subCategoryIdValidator),
		controller.deleteSubCategory
	);

export default subCategoryRouter;
