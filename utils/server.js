/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import apiRoutes from "../routes/index.router.js";
import connect from "./connectDB.js";
import mongoSanitize from "express-mongo-sanitize";
import { google } from "googleapis";

dotenv.config();

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
		max: 15,
		standardHeaders: true,
		legacyHeaders: false,
	});

	app.use(limiter);
	app.use(
		mongoSanitize({
			replaceWith: "_",
		})
	);

	const scopes = [
		"profile",
		"email",
		"openid",
		"https://www.googleapis.com/auth/user.birthday.read",
		"https://www.googleapis.com/auth/user.emails.read",
		"https://www.googleapis.com/auth/user.organization.read",
		"https://www.googleapis.com/auth/userinfo.email",
		"https://www.googleapis.com/auth/userinfo.profile",
	];

	app.get("api/auth-test", (req, res) => {
		// Define your Google OAuth 2.0 credentials
		const credentials = {
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uris: [`${req.protocol}://${req.headers.host}/api/auth`],
		};
		// Create the OAuth2 client
		const oAuth2Client = new google.auth.OAuth2(
			credentials.client_id,
			credentials.client_secret,
			credentials.redirect_uris[0]
		);

		// Generate the authentication URL
		const authURL = oAuth2Client.generateAuthUrl({
			access_type: "offline",
			scope: scopes,
		});

		res.redirect(authURL);
	});

	app.use("/api", apiRoutes);
	return app;
}
