const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");

const {
  validateSignUp,
  validateLogin,
} = require("../middleware/formValidation");
const { BadRequest } = require("../utils/errors");

router.post("/register", validateSignUp, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().map((err) => err.msg)[0];
    throw new BadRequest(error);
  } else {
    return res.status(200).json({
      success: true,
    });
  }
});

router.post("/login", validateLogin, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().map((err) => err.msg)[0];
    throw new BadRequest(error);
  } else {
    return res.status(200).json({
      success: true,
    });
  }
});

module.exports = router;
