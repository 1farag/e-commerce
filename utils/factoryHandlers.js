import { asyncHandler } from "../middleware/errorHandling.js";
import ApiFeatures from "./apiFeatures.js";
import { DocumentDoesNotExist } from "./errors.js";
import {
	CreatedResponse,
	DeletedResopnse,
	RetrivedResponse,
	UpdatedResponse,
} from "./response/response.index.js";

export const deleteOne = (model) =>
	asyncHandler(async (req, res, next) => {
		const result = await model.findByIdAndDelete(req.params.id);

		if (!result) return next(new DocumentDoesNotExist(`${model.modelName}`));

		const response = new DeletedResopnse([], req);

		res.status(response.statusCode).json(response.getResponseJSON());
	});

export const retriveOne = (model) =>
	asyncHandler(async (req, res, next) => {
		const result = await model.findById(req.params.id);

		if (!result) return next(new DocumentDoesNotExist(`${model.modelName}`));

		const response = new RetrivedResponse([result], req);

		res.status(response.statusCode).json(response.getResponseJSON());
	});

export const retriveAll = (model, modelName) =>
	asyncHandler(async (req, res) => {
		let filter = {};
		if (req.filter) {
			filter = req.filter;
		}
		const numDocuments = await model.countDocuments();
		const apiFeatures = new ApiFeatures(model.find({ ...filter }), req.query)
			.paginate(numDocuments)
			.sort()
			.limitFields()
			.filter()
			.search(modelName);

		const { mongooseQuery, pagination } = apiFeatures;
		const result = await mongooseQuery.exec();
		const response = new RetrivedResponse(result, req, "success", pagination);
		res.status(response.statusCode).json(response.getResponseJSON());
	});

export const updateOne = (model) =>
	asyncHandler(async (req, res, next) => {
		const result = await model.findOneAndUpdate({ _id: req.params.id }, req.body, {
			new: true,
		});
		if (!result) return next(new DocumentDoesNotExist(`${model.modelName}`));

		const response = new UpdatedResponse([result], req);
		res.status(response.statusCode).json(response.getResponseJSON());
	});

export const createOne = (model) =>
	asyncHandler(async (req, res) => {
		const result = await model.create(req.body);
		const response = new CreatedResponse([result], req);
		res.status(response.statusCode).json(response.getResponseJSON());
	});
