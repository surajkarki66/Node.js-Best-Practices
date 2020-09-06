import Joi from "joi";
const schemas = {
  accountSIGNUP: Joi.object().keys({
    username: Joi.string().min(4).max(20).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    role: Joi.string().valid("basic", "admin").required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: Joi.ref("password"),
  }),
  accountLOGIN: Joi.object().keys({
    username: Joi.string().min(4).max(20).required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: Joi.ref("password"),
  }),
  accountDELETE: Joi.object().keys({
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  }),
  accountLIST: Joi.object().keys({
    page: Joi.number().required(),
    usersPerPage: Joi.number().required(),
  }),
  accountDETAIL: Joi.object().keys({
    id: Joi.string().required(),
  }),
  accountUPDATE: Joi.object().keys({
    username: Joi.string().min(4).max(20),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    role: Joi.string().valid("basic", "admin"),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  }),
};
export default schemas;
