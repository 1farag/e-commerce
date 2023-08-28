import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		cartItems: {
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
		coupon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Coupon",
		},
		totalAmount: { type: Number, required: true },
		totalQuantity: { type: Number, required: true },
		totalAmountAfterDiscount: { type: Number },
	},
	{ timestamps: true }
);

cartSchema.methods.CheckIfProductExistInCart = async function (productId) {
	const cart = this;
	const productExist = cart.cartItems.find(
		(item) => item.product.toString() === productId
	);
	return productExist;
};
const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
