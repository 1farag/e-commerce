/* eslint-disable no-console */
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

if (!process.env.SENDGRID_API_KEY) {
	throw new Error("SENDGRID_API_KEY not set in environment");
}
if (!process.env.SENDGRID_FROM_EMAIL) {
	throw new Error("SENDGRID_FROM_EMAIL not set in environment");
}

//ES6
export const sendEmail = async (email, msg, subject = "No Subject") => {
	if (!email || typeof email !== "string") {
		throw new Error("Invalid email address");
	}

	if (!msg || typeof msg !== "string") {
		throw new Error("Invalid message content");
	}

	if (typeof subject !== "string") {
		throw new Error("Invalid subject");
	}

	const form = {
		to: email,
		from: process.env.SENDGRID_FROM_EMAIL,
		subject,
		text: msg,
	};

	try {
		await sgMail.send(form);
	} catch (error) {
		console.error(error);

		if (error.response) {
			console.error(error.response.body);
		}
	}
};
