import mongoose from "mongoose";
import bcrypt from "bcrypt";
import addressSchema from "./address.model.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import sendEmail from "../utils/sendEmail.js";
import { FailedToSendEmail } from "../utils/errors.js";

const UserSchema = new mongoose.Schema(
	{
		profileImgUrl: {
			type: String,
			default: "",
		},
		firstName: {
			type: String,
			required: [true, "First name is required"],
			trim: true,
			minlength: [3, "First name must be at least 3 characters"],
			maxlength: [20, "First name must be at most 20 characters"],
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			trim: true,
			lowercase: true,
			minlength: [3, "Last name must be at least 3 characters"],
			maxlength: [20, "Last name must be at most 20 characters"],
			min: 3,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			trim: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: "Password is required",
			minlength: [8, "Too short password, minimum length is 8 characters"],
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
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

UserSchema.index({ fullName: 1, email: 1 });




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

UserSchema.methods.generateEmailToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id }, process.env.JWT_EMAIL_SECRET, {
		expiresIn: process.env.JWT_EMAIL_EXPIRES_IN,
	});
	return token;
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
		const token = await user.generateEmailToken();
		user.isVerified = false;
		const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
		const resending = `${process.env.CLIENT_URL}/resend-email/${user._id}`;
		const message = `Please click on the link below to verify your email address:
	 \n\n ${url} \n\n If you did not request this, please ignore this email and your password will remain unchanged.
	  \n\n If you want to resend the email verification link, please click on the link below: \n\n ${resending}`;
		try {
			await sendEmail({
				email: user.email,
				subject: "Email verification",
				message,
			});
		} catch (error) {
			next(new FailedToSendEmail());
		}
	}
	next();
});

const User = mongoose.model("User", UserSchema);

export default User;
