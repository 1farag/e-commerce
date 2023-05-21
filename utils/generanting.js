import crypto from "crypto";

export default function generateRandomPassword(length = 10) {
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
	const randomBytes = crypto.randomBytes(length);
	let password = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = randomBytes[i] % charset.length;
		password += charset[randomIndex];
	}

	return password;
}
