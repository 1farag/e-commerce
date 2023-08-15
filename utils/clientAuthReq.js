import { google } from "googleapis";

const clientAuthReq = (req, res) => {
	// Define your Google OAuth 2.0 credentials
	const credentials = {
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uris: [`${req.protocol}://${req.headers.host}/api/auth/google/`],
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
		scope: [
			"profile",
			"email",
			"openid",
			"https://www.googleapis.com/auth/user.birthday.read",
			"https://www.googleapis.com/auth/user.emails.read",
			"https://www.googleapis.com/auth/user.organization.read",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		],
	});

	res.redirect(authURL);
};

export default clientAuthReq;
