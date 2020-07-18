const jwtSecret = require("../../common/config/env.config.js").jwt_secret;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.login = (req, res) => {
  try {
    const refreshId = req.body.userId + jwtSecret;
    const salt = crypto.randomBytes(16).toString("base64");
    const hash = crypto
      .createHmac("sha512", salt)
      .update(refreshId)
      .digest("base64");
    req.body.refreshKey = salt;
    const token = jwt.sign(req.body, jwtSecret);
    const b = new Buffer.from(hash);
    const refresh_token = b.toString("base64");
    res.status(201).json({ accessToken: token, refreshToken: refresh_token });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = (req, res) => {
  try {
    req.body = req.jwt;
    const token = jwt.sign(req.body, jwtSecret);
    res.status(201).json({ id: token });
  } catch (err) {
    next(err);
  }
};
