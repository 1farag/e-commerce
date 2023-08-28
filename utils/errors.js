export class InvalidHeaderToken extends Error {
	constructor() {
		super("In-valid header Token");
	}
}
export class TokenIsBlocked extends Error {
	constructor() {
		super(" Your Token is blocked, please login again");
	}
}
export class InvalidToken extends Error {
	constructor() {
		super("In-valid Token");
	}
}

export class UserAlreadyVerified extends Error {
	constructor() {
		super("User already verified");
	}
}

export class InvalidCode extends Error {
	constructor() {
		super("Invalid verification code");
	}
}

export class EmailAlreadyVerified extends Error {
	constructor() {
		super("Email already verified");
	}
}

export class TokenExpiredError extends Error {
	constructor() {
		super("Token Expired");
	}
}

export class ItemAlreadyExist extends Error {
	constructor(documentName) {
		super(`Item already exist in ${documentName}`);
	}
}

export class AuthenticationError extends Error {
	constructor() {
		super("Should be authenticate to access this route");
	}
}

export class BlackListError extends Error {
	constructor() {
		super("The token is blocked, please login again");
	}
}

export class FailedToCreate extends Error {
	constructor() {
		super("Failed to create new document");
	}
}

export class DocumentDoesNotExist extends Error {
	constructor(documentName) {
		super(`Document ${documentName} Does Not Exist`);
	}
}
export class FailedVerifyPassword extends Error {
	constructor() {
		super("The password does not match");
	}
}

export class RouteNotFound extends Error {
	constructor() {
		super("Requested route doesn't exist");
	}
}

export class ZodError extends Error {
	constructor(err) {
		const msg = err.errors.map((issue) => {
			const errorMessage = `${issue.path.join(".")} : ${issue.message} `;
			return errorMessage;
		});
		super(msg);
	}
}

export class InvalidFileType extends Error {
	constructor() {
		super("Invalid file type");
	}
}

export class InvalidCoupon extends Error {
	constructor() {
		super("Coupon is invalid or expired");
	}
}

export class InvalidFileFormat extends Error {
	constructor(fileFormat) {
		super(`Invalid ${fileFormat} format.`);
	}
}

export class EmailAlreadyExists extends Error {
	constructor() {
		super("Email already exists");
	}
}

export class FailedToUpload extends Error {
	constructor(err) {
		super(`Failed to upload file : ${err.message}`);
	}
}

export class FailedToDelete extends Error {
	constructor(err) {
		super(`Failed to delete file : ${err.message}`);
	}
}

export class FailedToUpdate extends Error {
	constructor(err) {
		super(`Failed to update file : ${err.message}`);
	}
}

export class FailedToGet extends Error {
	constructor(err) {
		super(`Failed to fetch data : ${err.message}`);
	}
}

export class FailedToSendEmail extends Error {
	constructor(err) {
		super(`Failed to send email : ${err.message}`);
	}
}

