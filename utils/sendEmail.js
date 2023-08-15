/* eslint-disable no-console */
import sgMail from "@sendgrid/mail";

async function sendEmail(dest, subject, message) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const msg = {
		to: dest,
		from: process.env.SENDGRID_FROM_EMAIL,
		subject: subject,
		text: message,
		html: message,
	};
	sgMail
		.send(msg)
		.then(() => {
			console.log("Email sent");
		})
		.catch((error) => {
			console.error(error);
		});
}
export default sendEmail;