import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Brand required"],
		unique: [true, "Brand must be unique"],
		minlength: [3, "Too short Brand name"],
		maxlength: [32, "Too long Brand name"],
		trim: true,
	},
	slug: {
		type: String,
		lowercase: true,
	},
	brandImage: {
		type: String,
		default: "",
	},
});

brandSchema.pre("save", function (next) {
	this.slug = this.name.toLowerCase().replace(/ /g, "-");
	next();
});

brandSchema.pre("findOneAndUpdate", function (next) {
	const update = this.getUpdate();
	if (update.title) {
		update.slug = update.title.toLowerCase().replace(/ /g, "-");
	}
	next();
});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
