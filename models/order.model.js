import mongoose from "mongoose";
import addressSchema from "./address.model.js";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: { type: Number, default: 1 },
				price: { type: Number, required: true },
				color: { type: String, required: true },
				size: { type: String, required: true },
			},
		],
		shippingAddress: {
			type: [addressSchema],
			required: true,
		},
		paymentMethod: {
			type: String,
			enum: ["cash", "stripe"],
			required: true,
		},
		taxPrice: { type: Number, required: true, default: 0.0 },
		shippingPrice: { type: Number, required: true, default: 0.0 },
		orderPrice: { type: Number, required: true, default: 0.0 },
		totalPrice: { type: Number, required: true, default: 0.0 },
		isPaid: { type: Boolean, default: false },
		paidAt: { type: Date },
		isDelivered: { type: Boolean, default: false },
		deliveredAt: { type: Date },
		orderStatus: {
			type: String,
			enum: ["pending", "processing", "paid", "shipped", "delivered", "cancelled"],
			required: true,
		},
		orderNote: { type: String },
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
