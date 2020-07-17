const { check } = require("express-validator");

exports.validateSignUp = [
  check("firstname", "First Name is required.")
    .notEmpty()
    .isLength({
      min: 4,
      max: 32,
    })
    .withMessage("First name must be between 3 to 32 characters."),
  check("lastname", "Last Name is required.")
    .notEmpty()
    .isLength({
      min: 4,
      max: 32,
    })
    .withMessage("Last name must be between 3 to 32 characters."),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password", "password is required").notEmpty(),
  check("password")
    .isLength({
      min: 8,
    })
    .withMessage("Password must contain at least 8 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),
];

exports.validateLogin = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password", "password is required").notEmpty(),
  check("password")
    .isLength({
      min: 8,
    })
    .withMessage("Password must contain at least 8 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),
];
