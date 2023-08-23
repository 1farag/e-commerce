import Product from "../models/product.model.js";
import {
	createOne,
	deleteOne,
	retriveAll,
	retriveOne,
	updateOne,
} from "../utils/factoryHandlers.js";

export const setUserId = (req, res, next) => {
	// Nested route (Create)
	req.body.owner = req.user.id;
	next();
};

export const createProduct = createOne(Product);

export const getProducts = retriveAll(Product, "product");

export const getProductById = retriveOne(Product);

export const updateProduct = updateOne(Product);

export const deleteProduct = deleteOne(Product);
