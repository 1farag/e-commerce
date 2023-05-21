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
