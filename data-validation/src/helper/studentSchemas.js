import Joi from "joi";
const schemas = {
  // schema for body
  studentPOST: Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required(),
    year: Joi.number().integer().min(2017).max(3017),
    major: Joi.string().valid(
      "Math",
      "English",
      "Computer Science",
      "History",
      null
    ),
    gpa: Joi.number().required(),
    address: Joi.object().keys({
      street: Joi.string().required(),
      city: Joi.string().required(),
    }),
  }),
};
export default schemas;
