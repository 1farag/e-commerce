import Stripe from "stripe";

async function payment({
	payment_method_types = ["card"],
	mode = "payment",
	customer_email,
	metadata = {},
	cancel_url = process.env.STRIPE_CANCEL_URL,
	success_url = process.env.STRIPE_SUCCESS_URL,
	discouts = [],
	line_items = [],
} = {}) {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
	const session = await stripe.checkout.sessions.create({
		payment_method_types,
		mode,
		customer_email,
		metadata,
		cancel_url,
		success_url,
		discouts,
		line_items,
	});
	return session;
}

export default payment;
