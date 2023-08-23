import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Category name is required"],
		trim: true,
		lowercase: true,
		minlength: [3, "Category name must be at least 3 characters"],
		maxlength: [32, "Category name must be at most 32 characters"],
		unique: [true, "Category name must be unique"],
	},
	slug: {
		type: String,
		lowercase: true,
	},
});
categorySchema.pre("save", function (next) {
	this.slug = this.name.toLowerCase().replace(/ /g, "-");
	next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
	const update = this.getUpdate();
	if (update.title) {
		update.slug = update.title.toLowerCase().replace(/ /g, "-");
	}
	next();
});
const Category = mongoose.model("Category", categorySchema);

export default Category;
