import Joi from "joi";
const schemas = {
  // schema for body => One-to-Few Relationships with Embedded Documents
  userPOST: Joi.object().keys({
    name: Joi.string().min(3).max(15).required(),
    company: Joi.string().max(20).required(),
    social: Joi.object().keys({
      twitter: Joi.string().alphanum().min(3).max(30).required(),
      github: Joi.string().alphanum().min(3).max(30).required(),
    }),
    website: Joi.string().required(),
    address: Joi.array()
      .length(2)
      .items(
        Joi.object().keys({
          street: Joi.string().max(30).required(),
          city: Joi.string().max(30).required(),
          cc: Joi.string().max(10).required(),
        })
      ),
  }),
  userLIST: Joi.object().keys({
    page: Joi.number().required(),
    usersPerPage: Joi.number().required(),
  }),
};
export default schemas;
