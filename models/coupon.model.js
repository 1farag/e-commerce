import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			unique: true,
			uppercase: true,
			required: "Name is required",
			minlength: [4, "Too short"],
			maxlength: [12, "Too long"],
		},
		expire: {
			type: Date,
			required: true,
		},
		discount: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;