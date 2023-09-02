import { asyncHandler } from "../middleware/errorHandling.js";
import Order from "../models/order.model.js";
import { createOrderDB, updateOrderDB, webhookDB } from "../services/order.services.js";
import { deleteOne, retriveAll, retriveOne } from "../utils/factoryHandlers.js";
import { CreatedResponse, UpdatedResponse } from "../utils/response/response.index.js";

export const filterByUserId = (req, res, next) => {
	// Nested route (Read)
	let filter = {};
	filter = { user: req.user._id };
	req.filter = filter;
	next();
};

// access Private/Admin || Private (user) by filterByUserId
export const getAllOrders = retriveAll(Order, "order");

// @access Private/Admin
export const getOrderById = retriveOne(Order);

// @access Private/Admin

export const deleteOrder = deleteOne(Order);

// @access Private/User
export const createOrder = asyncHandler(async (req, res) => {
	const result = await createOrderDB(req.body, req.user._id);
	const response = CreatedResponse([result], "Order created successfully");
	res.status(response.statusCode).json(response.getResponseJSON());
});

// @access Private/Admin
export const updateOrder = asyncHandler(async (req, res) => {
	const result = await updateOrderDB(req.params.orderId, req.body.orderStatus);
	const response = UpdatedResponse([result], "Order Status Updated");
	res.status(response.statusCode).json(response.getResponseJSON());
});

export const webhook = asyncHandler(async (req, res) => {
	const payload = req.body;
	const sig = req.headers["stripe-signature"];

	await webhookDB(payload, sig);
	const response = UpdatedResponse([], "Order Status Updated");
	res.status(response.statusCode).json(response.getResponseJSON());
});
