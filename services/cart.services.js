import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import {
	DocumentDoesNotExist,
	FailedToGet,
	FailedToUpdate,
	InvalidCoupon,
} from "../utils/errors.js";

export const addToCartDB = async (cartItems, userId) => {
	try {
		const { product, quantity, color, size } = cartItems;
		const productExist = await Product.findOne({
			_id: product,
			quantity: { $gte: quantity },
			color,
			size,
		});
		if (!productExist) throw new DocumentDoesNotExist("Product");

		const updatedCart = await Cart.findOneAndUpdate(
			{ user: userId },
			{
				$addToSet: {
					cartItems: { product, quantity, price: productExist.price, color, size },
				},
				$inc: {
					totalQuantity: quantity,
					totalAmount: Number(productExist.price * quantity).toFixed(2),
				},
			},
			{ new: true, upsert: true }
		);
		return updatedCart;
	} catch (error) {
		throw new FailedToUpdate(error);
	}
};

export const updateItemInCartDB = async (product, quantity, userId) => {
	try {
		const cart = await Cart.findOne({ user: userId });
		if (!cart) throw new DocumentDoesNotExist("Cart");

		const updatedItem = cart.cartItems.find(
			(item) => item.product.toString() === product
		);

		if (!updatedItem) throw new DocumentDoesNotExist("Item");

		const updatedCart = await cart.updateOne(
			{
				$set: {
					"cartItems.$.quantity": quantity,
					"cartItems.$.price": updatedItem.price * quantity,
				},
				$inc: {
					totalQuantity: quantity - updatedItem.quantity,
					totalAmount: Number(
						updatedItem.price * quantity - updatedItem.price * updatedItem.quantity
					).toFixed(),
				},
			},
			{ new: true }
		);
		return updatedCart;
	} catch (error) {
		throw new FailedToUpdate(error);
	}
};

export const removeItemFromCartDB = async (product, userId) => {
	try {
		const cart = await Cart.findOne({ user: userId });
		if (!cart) throw new DocumentDoesNotExist("Cart");

		const updatedItem = cart.cartItems.find(
			(item) => item.product.toString() === product
		);

		if (!updatedItem) throw new DocumentDoesNotExist("Item");

		const updatedCart = await Cart.findOneAndUpdate(
			{ user: userId, "cartItems.product": product },
			{
				$pull: {
					cartItems: { product },
				},
				$inc: {
					totalQuantity: -updatedItem.quantity,
					totalAmount: (-updatedItem.price * updatedItem.quantity).toFixed(2),
				},
			},
			{ new: true }
		);
		return updatedCart;
	} catch (error) {
		throw new FailedToUpdate(error);
	}
};

export const getCartDB = async (userId) => {
	try {
		const cart = await Cart.findOne({ user: userId });
		if (!cart) throw new DocumentDoesNotExist("Cart");
		return cart;
	} catch (error) {
		throw new FailedToGet(error);
	}
};

export const clearCartDB = async (userId) => {
	try {
		const cart = await Cart.findOneAndDelete({ user: userId });
		if (!cart) throw new DocumentDoesNotExist("Cart");
	} catch (error) {
		throw new FailedToUpdate(error);
	}
};

export const applyCouponToCartDB = async (coupon, userId) => {
	try {
		const cart = await Cart.findOne({ user: userId });
		if (!cart) throw new DocumentDoesNotExist("Cart");

		const couponExist = await Coupon.findOne({
			name: coupon,
			expire: { $gt: Date.now() },
		});

		if (!couponExist) throw new InvalidCoupon();

		const { discount } = couponExist;

		const totalAmountAfterDiscount = Number(
			cart.totalAmount - (cart.totalAmount * discount) / 100
		).toFixed(2);

		const updatedCart = await Cart.findOneAndUpdate(
			{ user: userId },
			{
				$set: { coupon: couponExist._id, totalAmountAfterDiscount },
			},
			{ new: true }
		);
		return updatedCart;
	} catch (error) {
		throw new FailedToUpdate(error);
	}
};
