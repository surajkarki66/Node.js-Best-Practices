const UserModel = require("../../users/models/users.models");
const crypto = require("crypto");

const { validationResult } = require("express-validator");
const { NotFound, BadRequest } = require("../../common/utils/errors");

exports.isPasswordAndUserMatch = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().map((err) => err.msg)[0];
    throw new BadRequest(error);
  } else {
    UserModel.findByEmail(req.body.email)
      .then((user) => {
        if (!user) {
          throw new NotFound("User is not exist.");
        } else {
          let passwordFields = user.password.split("$");
          console.log(passwordFields)
          let salt = passwordFields[0];
          let hash = crypto
            .createHmac("sha512", salt)
            .update(req.body.password)
            .digest("base64");
          if (hash === passwordFields[1]) {
            req.body = {
              userId: user._id,
              email: user.email,
              permissionLevel: user.permissionLevel,
              provider: "email",
              name: user.firstName + " " + user.lastName,
            };
            return next();
          } else {
            throw new BadRequest("Invalid e-mail or password");
          }
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};
