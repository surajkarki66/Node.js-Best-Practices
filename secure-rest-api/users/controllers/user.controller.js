const UserModel = require("../models/users.models");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const { BadRequest, Conflict } = require("../../common/utils/errors");

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array().map((err) => err.msg)[0];
    throw new BadRequest(error);
  } else {
    UserModel.findByEmail(req.body.email)
      .then((user) => {
        if (!user) {
            const salt = crypto.randomBytes(16).toString("base64");
            const hash = crypto
              .createHmac("sha512", salt)
              .update(req.body.password)
              .digest("base64");
            req.body.password = salt + "$" + hash;
            req.body.permissionLevel = 1;
            UserModel.createUser(req.body)
              .then((result) => {
                res.status(201).json({ id: result._id });
              })
              .catch((error) => {
                  console.log(error);
                next(error);
              });
          
        } else {
            throw new Conflict("Email is already taken.");
        }
      })
      .catch((error) => {
        next(error);
      });
  }
};
