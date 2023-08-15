import mongoose from "mongoose";
import bcrypt from "bcrypt";
import addressSchema from "./address.model.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import sendEmail from "../utils/sendEmail.js";
const UserSchema = new mongoose.Schema({
	profileImgUrl: {
		type: String,
		default: "",
	},
	firstName: {
		type: String,
		required: true,
		trim: true,
		min: 3,
		max: 20,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
		min: 3,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	passwordChangedAt: Date,
	salt: {
		type: String,
		required: false,
	},
	address: {
		type: [addressSchema],
		default: [],
	},
	isVerified: {
		type: Boolean,
		required: true,
		default: false,
	},
	verificationCode: {
		type: String,
	},
	blocked: {
		type: Boolean,
		required: true,
		default: false,
	},
	googleId: {
		type: String,
	},
	registeredWithGoogle: {
		type: Boolean,
		default: false,
	},
});

UserSchema.methods.isValidPassword = async function (password) {
	const user = this;
	const saltingPassword = this.salt + password;
	const compare = await argon2.verify(user.password, saltingPassword);
	return compare;
};

UserSchema.methods.generateAuthToken = async function (useragent) {
	const user = this;
	const token = jwt.sign({ _id: user._id, useragent }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
	return token;
};

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.salt;
	delete userObject.verificationCode;
	delete userObject.passwordChangedAt;
	delete userObject.googleId;
	delete userObject.registeredWithGoogle;
	return userObject;
};

UserSchema.methods.generateVerificationCode = async function () {
	const user = this;
	const verificationCode = Math.floor(100000 + Math.random() * 900000);
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(verificationCode.toString(), salt);
	user.verificationCode = hash;
	user.save();
	return verificationCode;
};

UserSchema.methods.verifyCode = async function (code) {
	const user = this;
	const compare = await bcrypt.compare(code, user.verificationCode);
	return compare;
};

UserSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		const salt = await bcrypt.genSalt(process.env.SALT);
		const SaltedPassword = salt + user.password;
		const hash = await argon2.hash(SaltedPassword);
		user.password = hash;
		user.salt = salt;
		user.passwordChangedAt = Date.now();
	}
	if (user.isModified("email")) {
		const verificationCode = await user.generateVerificationCode();
		user.isVerified = false;
		await sendEmail(user.email, verificationCode, "Verification Code");
	}
	next();
});

const User = mongoose.model("User", UserSchema);

export default User;
