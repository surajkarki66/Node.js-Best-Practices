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

exports.list = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().map((err) => err.msg)[0];
    throw new BadRequest(error);
  } else {
    const limit =
      req.query.limit && req.query.limit <= 100
        ? parseInt(req.query.limit)
        : 10;
    let page = 0;
    if (req.query) {
      if (req.query.page) {
        req.query.page = parseInt(req.query.page);
        page = Number.isInteger(req.query.page) ? req.query.page : 0;
      }
    }
    UserModel.list(limit, page)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.getById = (req, res, next) => {
  UserModel.findById(req.params.userId)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().map((err) => err.msg)[0];
    throw new BadRequest(error);
  } else {
    if (req.body.password) {
      let salt = crypto.randomBytes(16).toString("base64");
      let hash = crypto
        .createHmac("sha512", salt)
        .update(req.body.password)
        .digest("base64");
      req.body.password = salt + "$" + hash;
    }

    UserModel.patchUser(req.params.userId, req.body)
      .then((result) => {
        res.status(204).json({ success: true });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.removeById = (req, res, next) => {
  UserModel.removeById(req.params.userId)
    .then((result) => {
      res.status(204).json({ success: true });
    })
    .catch((err) => {
      next(err);
    });
};
