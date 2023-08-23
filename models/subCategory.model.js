import mongoose from "mongoose";
const subCategorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Sub Category name is required"],
		trim: true,
		lowercase: true,
		minlength: [3, "Sub Category name must be at least 3 characters"],
		maxlength: [32, "Sub Category name must be at most 32 characters"],
		unique: [true, "Sub Category name must be unique"],
	},
	slug: {
		type: String,
		lowercase: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
});

subCategorySchema.pre("save", function (next) {
	this.slug = this.name.toLowerCase().replace(/ /g, "-");
	next();
});

subCategorySchema.pre(/^find/, function (next) {
	this.populate({
		path: "category",
		select: "name",
	});
	next();
});
subCategorySchema.pre("findOneAndUpdate", function (next) {
	const update = this.getUpdate();
	if (update.title) {
		update.slug = update.title.toLowerCase().replace(/ /g, "-");
	}
	next();
});
const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
