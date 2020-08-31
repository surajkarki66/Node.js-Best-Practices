import Joi from "joi";
const schemas = {
  // schema for body => One-to-One Relationships with Embedded Documents
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
  studentLIST: Joi.object().keys({
    page: Joi.number().required(),
    studentsPerPage: Joi.number().required(),
    name: Joi.string(),
    year: Joi.number(),
    street: Joi.string(),
    city: Joi.string(),
  }),
  // schema for path params
  studentDETAIL: Joi.object().keys({
    id: Joi.string().required(),
  }),
  studentFACETED: Joi.object().keys({
    page: Joi.number().required(),
    studentsPerPage: Joi.number().required(),
    major: Joi.string().required(),
  }),
};
export default schemas;
