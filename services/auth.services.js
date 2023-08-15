import User from "../models/user.model.js";
import {
	DocumentDoesNotExist,
	EmailAlreadyVerified,
	FailedToCreate,
	FailedVerifyPassword,
	InvalidCode,
	InvalidToken,
	UserAlreadyVerified,
} from "../utils/errors.js";
import generateRandomPassword from "../utils/generanting.js";
import { google } from "googleapis";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import TokenBlackList from "../models/token.model.js";

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
	if (user && !user.isVerified) {
		user.isVerified = true;
		await user.save();
	}

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

export const logoutDB = async (req) => {
	const token = new TokenBlackList({
		token: req.token,
	});
	await token.save();
};

export const verifyNewEmailDB = async (req) => {
	const { token } = req.params;

	const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

	if (!decoded) throw new InvalidToken();

	const user = await User.findById(decoded.id);

	if (!user) throw new DocumentDoesNotExist();

	if (user.isVerified) throw new UserAlreadyVerified();

	user.isVerified = true;

	await user.save();

	return user;
};

export const refreshEmailDB = async (req) => {
	const { userId } = req.params;
	const user = await User.findById(userId);
	if (!user) throw new DocumentDoesNotExist();
	if (!user.isVerified) throw EmailAlreadyVerified();
	const token = await user.generateEmailToken();
	const url = `${process.env.CLIENT_URL}/verify-email/${token}`;

	await sendEmail({
		email: user.email,
		subject: "Email verification token",
		message: `Please click on the link below to verify your email address: \n\n ${url}`,
	});
	return "Email sent successfully";
};

export const forgetPasswordDB = async (req) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) throw new DocumentDoesNotExist("user");
	const verificationCode = await user.generateVerificationCode();
	await sendEmail(email, "Verification Code", verificationCode);
	await user.save();
};

export const forgetPasswordVerificationDB = async (req) => {
	const { email, verificationCode, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) throw new DocumentDoesNotExist("user");
	const checkCode = await user.verifyCode(verificationCode);
	if (!checkCode) throw InvalidCode();
	user.password = password;
	user.passwordChangedAt = Date.now();
	await user.save();
};

export const changePasswordDB = async (req) => {
	const { password, newPassword } = req.body;
	const user = req.user;
	const checkPassword = await user.isValidPassword(password);
	if (!checkPassword) throw new FailedVerifyPassword();

	user.password = newPassword;
	await user.save();
	return "Password changed successfully";
};


