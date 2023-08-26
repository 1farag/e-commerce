import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Product name is required"],
			trim: true,
			lowercase: true,
			minlength: [3, "Product name must be at least 3 characters"],
			maxlength: [32, "Product name must be at most 32 characters"],
			unique: [true, "Product name must be unique"],
		},
		slug: {
			type: String,
			lowercase: true,
		},
		description: {
			type: String,
			required: [true, "Product description is required"],
			trim: true,
			lowercase: true,
			minlength: [3, "Product description must be at least 3 characters"],
			maxlength: [2000, "Product description must be at most 2000 characters"],
		},
		price: {
			type: Number,
			required: [true, "Product price is required"],
			trim: true,
			lowercase: true,
			min: [0, "Product price must be at least 0"],
			max: [1000000, "Product price must be at most 1000000"],
		},
		quantity: {
			type: Number,
			required: [true, "Product quantity is required"],
			trim: true,
			lowercase: true,
			min: [0, "Product quantity must be at least 0"],
			max: [1000000, "Product quantity must be at most 1000000"],
		},
		sold: {
			type: Number,
			default: 0,
		},
		imageCover: {
			type: String,
		},
		images: {
			type: [String],
			default: [],
		},
		color: {
			type: [String],
			default: ["#222"],
			required: true,
		},
		size: {
			type: String,
			enum: ["XS", "S", "M", "L", "XL"],
			required: [true, "Product size is required"],
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		subCategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "SubCategory",
			required: true,
		},
		brand: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Brand",
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
productSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "product",
	localField: "_id",
});

productSchema.pre(/^find/, function (next) {
	this.populate({
		path: "owner",
		select: "firstName lastName profileImgUrl",
	})
		.populate({
			path: "subCategory",
			select: "name slug",
		})
		.populate({
			path: "brand",
			select: "name slug",
		})
		.populate({
			path: "reviews",
			select: "title ratings description user createdAt -product ",
		});

	next();
});

productSchema.pre("save", function (next) {
	this.slug = this.title.toLowerCase().replace(/ /g, "-");
	next();
});

productSchema.pre("findOneAndUpdate", function (next) {
	// 'this' refers to the query object
	const update = this.getUpdate();
	if (update.title) {
		update.slug = update.title.toLowerCase().replace(/ /g, "-");
	}
	next();
});
const Product = mongoose.model("Product", productSchema);

export default Product;
