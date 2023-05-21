import NotFoundResponse from "./NotFoundResponse.js";

export default class NotFoundRouteResponse extends NotFoundResponse {
	constructor(req, err) {
		super(req);
		this.message = `${req.originalUrl}route doesn't exist on our Server`;
	}
}
