/* eslint-disable no-console */
import dotenv from "dotenv";

dotenv.config();
import createServer from "./utils/server.js";

const app = createServer();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
	console.log(`Server is running on PORT ${PORT}`);
});
