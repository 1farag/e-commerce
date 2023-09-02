import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { DocumentDoesNotExist, InvalidCoupon } from "../utils/errors.js";
import payment from "../utils/strip.js";
import Stripe from "stripe";

async function createOrderService(userId, paymentMethod, shippingAddress, orderNote) {
	const cart = await Cart.findOne({ user: userId })
		.populate("cartItems.product", "title quantity")
		.populate("coupon", "expiry")
		.populate("user", "email firstName lastName fullName addresses");

	if (!cart) throw new DocumentDoesNotExist("Cart");

	// check if product is in stock
	const outOfStock = cart.cartItems.find(
		(item) => item.product.quantity < item.quantity
	);

	if (outOfStock) throw new Error(`Product ${outOfStock.product.name} is out of stock`);

	// check if coupon is expired
	if (cart.coupon && cart.coupon.expiry < Date.now()) throw new InvalidCoupon();

	// calculate total price
	const orderPrice = cart.totalAmountAfterDiscount
		? cart.totalAmountAfterDiscount
		: cart.totalAmount;
	const taxPrice = Number(orderPrice * 0.15).toFixed(2);
	const shippingPrice = Number(orderPrice * 0.1).toFixed(2);
	const totalPrice = (orderPrice + Number(taxPrice) + Number(shippingPrice)).toFixed(2);
	// create order
	const order = new Order({
		paymentMethod,
		products: cart.cartItems.map((item) => {
			return {
				product: item.product._id,
				quantity: item.quantity,
				price: item.price,
				color: item.color,
				size: item.size,
			};
		}),
		taxPrice,
		shippingPrice,
		orderPrice,
		totalPrice,
		shippingAddress: shippingAddress ? shippingAddress : cart.user.addresses[0],
		orderStatus: "pending",
		user: cart.user._id,
		orderNote,
	});

	await order.save();
	// decrement quantity, increment sold
	const bulkOption = cart.cartItems.map((item) => {
		return {
			updateOne: {
				filter: { _id: item.product._id },
				update: { $inc: { quantity: -item.quantity, sold: +Number(item.quantity) } },
			},
		};
	});

	await Product.bulkWrite(bulkOption, {});

	// delete cart
	await Cart.findOneAndRemove({ _id: cart._id });

	return order;
}

export const createOrderDB = async (bodyData, userId) => {
	const { paymentMethod, shippingAddress, orderNote } = bodyData;
	const order = await (
		await createOrderService(userId, paymentMethod, shippingAddress, orderNote)
	).populate("products.product", "title price");

	if (!order) throw new Error("Order not created");

	if (paymentMethod === "cash") return order;

	const session = await payment({
		payment_method_types: ["card"],
		mode: "payment",
		customer_email: req.user.email,
		metadata: {
			orderId: order._id.toString(),
		},
		line_items: [
			// add cart products to stripe session
			...order.products.map((item) => {
				return {
					price_data: {
						currency: "usd",
						product_data: {
							name: item.product.title,
						},
						unit_amount: item.price * 100,
					},
					quantity: item.quantity,
				};
			}),
		],
	});

	return {
		order,
		sessionUrl: session.url,
	};
};

export const canceleOrder = async (orderId) => {
	const order = await Order.findById(orderId);
	if (!order) {
		throw new Error("Order not found");
	}
	order.orderStatus = "cancelled";
	await order.save();

	// increment quantity, decrement sold
	const bulkOption = order.products.map((item) => {
		return {
			updateOne: {
				filter: { _id: item.product },
				update: {
					$inc: { quantity: Number(item.quantity), sold: Number(-item.quantity) },
				},
			},
		};
	});
	await Product.bulkWrite(bulkOption, {});

	const cart = new Cart({
		user: order.user,
		cartItems: order.products.map((item) => {
			return {
				product: item.product,
				quantity: item.quantity,
				price: item.price,
				color: item.color,
				size: item.size,
			};
		}),
		totalAmount: order.orderPrice,
		totalQuantity: order.products.length,
	});
	await cart.save();

	console.log(cart);

	return cart;
};

export const webhookDB = async (payload, sig) => {
	let event;
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

	try {
		event = stripe.webhooks.constructEvent(
			payload,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (error) {
		throw new Error("Webhook error, please try again", error.message);
	}
	const session = event.data.object;

	const order = await Order.findById(session.metadata.orderId);
	if (event.type === "checkout.session.completed") {
		await canceleOrder(order._id);
		throw new Error("Failed to checkout");
	}

	if (order) {
		order.paymentInfo = {
			id: session.payment_intent,
			status: session.payment_status,
		};
		order.orderStatus = "paid";
		await order.save();
	}
};

export const webhook = async (req, res) => {
	const payload = req.body;
	const sig = req.headers["stripe-signature"];

	await webhookDB(payload, sig);

	res.status(200).json({ received: true });
};

export const updateOrderDB = async (orderId, orderStatus) => {
	const order = await Order.findOne({ _id: orderId });

	if (!order) throw new DocumentDoesNotExist("Order");

	if (order.orderStatus === orderStatus) throw new Error("Order already updated");

	if (orderStatus === "cancelled") {
		await canceleOrder(orderId);
		return order;
	}
	order.orderStatus = orderStatus;

	await order.save();

	return order;
};
