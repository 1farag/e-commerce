import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "./errorHandling.js";
import TokenBlackList from "../models/token.model.js";
import {
	AuthenticationError,
	BlackListError,
	InvalidHeaderToken,
	TokenExpiredError,
	TokenIsBlocked,
} from "../utils/errors.js";

export const auth = asyncHandler(async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		throw new InvalidHeaderToken();
	}
	// check if token is blacklisted
	const blacklist = await TokenBlackList.findOne({ token: token });
	if (blacklist) {
		throw new TokenIsBlocked();
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	const user = await User.findOne({
		_id: decoded._id,
		blocked: false,
	});

	if (!user) {
		throw new AuthenticationError();
	}
	if (user.passwordChangedAt) {
		const passChangedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
		// Password changed after token created (Error)
		if (passChangedTimestamp > decoded.iat) {
			throw new TokenExpiredError();
		}
	}
	// check if user-agent is the same
	if (req.get("user-agent") != decoded.useragent) {
		const addToBlaackList = new TokenBlackList({ token: token });
		addToBlaackList.save();
		throw new BlackListError();
	}
	req.user = user;
	return next();
});
