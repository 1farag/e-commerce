import User from "../models/user.model.js";
import {
	DocumentDoesNotExist,
	FailedToCreate,
	FailedVerifyPassword,
} from "../utils/errors.js";
import generateRandomPassword from "../utils/generanting.js";
import { google } from "googleapis";

export const registerServiece = async (req) => {
	const { email, password, firstName, lastName } = req.body;
	const user = new User({
		email,
		password,
		firstName,
		lastName,
	});
	await user.save();
	if (!user) throw new FailedToCreate();
	const token = await user.generateAuthToken(req.get("user-agent"));
	return { user, token };
};

export const signInServiece = async (req) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) throw new DocumentDoesNotExist("user");
	const checkPassword = await user.isValidPassword(password);
	if (!checkPassword) throw new FailedVerifyPassword();
	const token = await user.generateAuthToken(req.get("user-agent"));
	return { user, token };
};

export const googleSignIn = async (req) => {
	const credentials = {
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uris: [`${req.protocol}://${req.headers.host}/api/auth`],
	};

	const code = req.query.code;

	// Create the OAuth2 client
	const oAuth2Client = new google.auth.OAuth2(
		credentials.client_id,
		credentials.client_secret,
		credentials.redirect_uris[0]
	);

	// Exchange the authorization code for an access token
	const { tokens } = await oAuth2Client.getToken(code);

	// Set the access token on the OAuth2 client
	oAuth2Client.setCredentials(tokens);

	// Get the user's email from the Google API
	const googleAPI = google.oauth2({ version: "v2", auth: oAuth2Client });
	const userInfo = await googleAPI.userinfo.get();
	const email = userInfo.data.email;

	let user = await User.findOne({
		email,
	});

	if (!user) {
		const genPass = generateRandomPassword();
		user = new User({
			email: userInfo.data.email,
			password: genPass,
			profileImgUrl: userInfo.data.picture,
			firstName: userInfo.data.given_name,
			lastName: userInfo.data.family_name,
			isVerified: true,
			registeredWithGoogle: true,
			googleId: userInfo.data.id,
		});
		await user.save();
	}

	const token = await user.generateAuthToken(req.get("user-agent"));
	return { user, token };
};

