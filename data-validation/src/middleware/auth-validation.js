import ApiError from "../error/ApiError";

const checkAuth = (req, res, next) => {
  if (req.headers["authorization"]) {
    try {
      const authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        next(ApiError.unauthorized("Authentication failed."));
        return;
      } else {
        req.jwt = jwt.verify(authorization[1], process.env.SECRET_KEY);
        return next();
      }
    } catch (err) {
      next(ApiError.forbidden("Token is not verified"));
      return;
    }
  } else {
    next(ApiError.unauthorized("Authentication failed"));
    return;
  }
};

export default checkAuth;
