const jwt = require("jsonwebtoken");
const secret = require("../config/env.config.js").jwt_secret;
const crypto = require("crypto");


const { BadRequest, Forbidden, Unauthorized } = require("../../common/utils/errors");

exports.verifyRefreshBodyField = (req, res, next) => {
  if (req.body && req.body.refreshToken) {
    return next();
  } else {
      throw new BadRequest('need to pass refresh_token field')
  }
};

exports.validRefreshNeeded = (req, res, next) => {
  const b = new Buffer.from(req.body.refreshToken, "base64");
  const refresh_token = b.toString();
  const hash = crypto
    .createHmac("sha512", req.jwt.refreshKey)
    .update(req.jwt.userId + secret)
    .digest("base64");
  if (hash === refresh_token) {
    req.body = req.jwt;
    return next();
  } else {
      throw new BadRequest('Invalid refresh token');
  }
};

exports.validJWTNeeded = (req, res, next) => {
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        throw new Unauthorized('Authentication failed');
      } else {
        req.jwt = jwt.verify(authorization[1], secret);
        return next();
      }
    } catch (err) {
      throw new Forbidden('Token is not verified.');
    }
  } else {
    throw new Unauthorized('Authentication failed');
  }
};
