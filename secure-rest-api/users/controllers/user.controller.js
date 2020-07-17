const UserModel = require("../models/users.models");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const { BadRequest } = require("../../common/utils/errors");

exports.insert = (req, res, next) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array().map((err) => err.msg)[0];
    throw new BadRequest(error);
  } else {
    UserModel.findByEmail(email)
      .then((user) => {
        if (user) {
          throw new BadRequest("Email is already taken.");
        } else {
          const salt = crypto.randomBytes(16).toString("base64");
          const hash = crypto
            .createHmac("sha512", salt)
            .update(req.body.password)
            .digest("base64");
          req.body.password = salt + "$" + hash;
          req.body.permissionLevel = 1;
          UserModel.createUser(req.body)
            .then((result) => {
              res.status(201).send({ id: result._id });
            })
            .catch((error) => {
              next(error);
            });
        }
      })
      .catch((error) => {
        next(error);
      });
  }
};
