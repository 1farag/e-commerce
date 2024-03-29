import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		ratings: {
			type: Number,
			min: [1, "Min ratings value is 1.0"],
			max: [5, "Max ratings value is 5.0"],
			required: [true, "review ratings required"],
		},
		description: {
			type: String,
			required: [true, "review description required"],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Review must belong to user"],
		},
		// parent reference (one to many)
		product: {
			type: mongoose.Schema.ObjectId,
			ref: "Product",
			required: [true, "Review must belong to product"],
		},
	},
	{ timestamps: true }
);
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
	this.populate({ path: "user", select: "firstName profileImgUrl" });
	next();
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
