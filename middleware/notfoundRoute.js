import { RouteNotFound } from "../utils/errors";

export default function notFoundRoute(req, res, next) {
	next(new RouteNotFound());
}
