import express from "express";
import * as controller from "../controllers/order.controller.js";
import validateRequest from "../middleware/validate.js";
import * as Schema from "../validations/order.validation.js";

import { auth } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter
	.route("/")
	.get(auth, controller.filterByUserId, controller.getAllOrders)
	.post(auth, validateRequest(Schema.createOrderValidator), controller.createOrder);

orderRouter
	.route("/:id")
	.get(auth, validateRequest(Schema.orderIdValidator), controller.getOrderById)
	.delete(auth, validateRequest(Schema.orderIdValidator), controller.deleteOrder)
	.put(auth, validateRequest(Schema.updateOrderValidator), controller.updateOrder);
orderRouter.get("/admin/orders", auth, controller.getAllOrders);
orderRouter.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	controller.webhook
);

export default orderRouter;
