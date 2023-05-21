import mongoose from "mongoose";

const TokenBlackListSchema = new mongoose.Schema({
	tokens: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
});
const TokenBlackList = mongoose.model("TokenBlackList", TokenBlackListSchema);
export default TokenBlackList;
