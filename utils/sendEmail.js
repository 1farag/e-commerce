/* eslint-disable no-console */
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//ES6
const sendEmail = async (email, msg, subject = "No Subject") => {
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

export default sendEmail;