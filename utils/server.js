/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import apiRoutes from "../routes/index.js";
import connect from "./connectDB.js";
import mongoSanitize from "express-mongo-sanitize";
import { globalErrorHandling } from "../middleware/errorHandling.js";
import notFoundRoute from "../middleware/notfoundRoute.js";

export default function createServer() {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors());
	app.use(morgan("tiny"));
	app.use(helmet());
	connect();
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 20,
		standardHeaders: true,
		legacyHeaders: false,
	});

	app.use(limiter);
	app.use(
		mongoSanitize({
			replaceWith: "_",
		})
	);

	app.use("/api", apiRoutes);
	app.use(notFoundRoute);
	app.use(globalErrorHandling);

	return app;
}
