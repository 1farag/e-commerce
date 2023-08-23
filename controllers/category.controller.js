import {
	createOne,
	deleteOne,
	retriveAll,
	retriveOne,
	updateOne,
} from "../utils/factoryHandlers.js";
import Category from "../models/category.model.js";

export const createCategory = createOne(Category);

export const getCategories = retriveAll(Category, "category");

export const getCategoryById = retriveOne(Category);

export const updateCategory = updateOne(Category);

export const deleteCategory = deleteOne(Category);
