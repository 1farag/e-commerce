class ApiFeatures {
	// mongooseQuery = model.find()
	// queryString = req.query
	constructor(mongooseQuery, queryString) {
		this.mongooseQuery = mongooseQuery;
		this.queryString = queryString;
	}

	filter() {
		const queryObj = { ...this.queryString };
		const excludedFields = ["page", "sort", "limit", "search"];
		excludedFields.forEach((el) => delete queryObj[el]);

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => `$${match}`);
		this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
		return this;
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(",").join(" ");
			this.mongooseQuery = this.mongooseQuery.sort(sortBy);
		} else {
			this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
		}
		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(",").join(" ");
			this.mongooseQuery = this.mongooseQuery.select(fields);
		} else {
			this.mongooseQuery = this.mongooseQuery.select("-__v");
		}
		return this;
	}

	paginate(numDocuments) {
		const page = parseInt(this.queryString.page) * 1 || 1;
		const limit = parseInt(this.queryString.limit) * 1 || 5;
		const skip = (page - 1) * limit;

		if (skip >= numDocuments) throw new Error("This page does not exist");
		const paginate = {};
		paginate.page = page;
		paginate.limit = limit;
		paginate.totalPages = Math.ceil(numDocuments / limit);

		this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

		this.pagination = paginate;

		return this;
	}

	search(modelName) {
		let query = {};
		if (this.queryString.search) {
			if (modelName === "product") {
				query.$or = [
					// $options: "i" means case insensitive
					{ title: { $regex: this.queryString.search, $options: "i" } },
					{ slug: { $regex: this.queryString.search, $options: "i" } },
				];
			} else if (modelName === "user") {
				query.$or = [
					{ fullName: { $regex: this.queryString.search, $options: "i" } },
					{ email: { $regex: this.queryString.search, $options: "i" } },
				];
			} else {
				query.$or = [
					{ name: { $regex: this.queryString.search, $options: "i" } },
					{ slug: { $regex: this.queryString.search, $options: "i" } },
				];
			}
			this.mongooseQuery = this.mongooseQuery.find(query);
			return this;
		}
		return this;
	}
}

export default ApiFeatures;
