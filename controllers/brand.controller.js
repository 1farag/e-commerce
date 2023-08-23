import {
	createOne,
	deleteOne,
	retriveAll,
	retriveOne,
	updateOne,
} from "../utils/factoryHandlers.js";
import Brand from "../models/brand.model.js";

export const createBrand = createOne(Brand);

export const getBrands = retriveAll(Brand, "Brand");

export const getBrandById = retriveOne(Brand);

export const updateBrand = updateOne(Brand);

export const deleteBrand = deleteOne(Brand);
