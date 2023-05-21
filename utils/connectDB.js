/* eslint-disable no-console */
import mongoose from "mongoose";

async function connect() {
	const DB_URI = process.env.DB_URI;

	try {
		await mongoose.connect(DB_URI);
		console.log("Database connected");
	} catch (error) {
		console.log(error);
	}
}

export default connect;
