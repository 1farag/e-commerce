import { RouteNotFound } from "../utils/errors.js";

export default function notFoundRoute(req, res, next) {
	next(new RouteNotFound());
}
