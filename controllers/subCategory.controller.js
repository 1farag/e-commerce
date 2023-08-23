import {
	createOne,
	deleteOne,
	retriveAll,
	retriveOne,
	updateOne,
} from "../utils/factoryHandlers.js";
import SubCategory from "../models/subCategory.model.js";

export const setCategoryIdToBody = (req, res, next) => {
	// Nested route (Create)
	if (!req.body.category) req.body.category = req.params.categoryId;
	next();
};

export const filterByCategoryId = (req, res, next) => {
	// Nested route (Read)
	let filter = {};
	if (req.params.categoryId) filter = { category: req.params.categoryId };
	req.filter = filter;
	next();
};
export const createSubCategory = createOne(SubCategory);

export const getSubCategories = retriveAll(SubCategory, "subCategory");

export const getSubCategoryById = retriveOne(SubCategory);

export const updateSubCategory = updateOne(SubCategory);

export const deleteSubCategory = deleteOne(SubCategory);
