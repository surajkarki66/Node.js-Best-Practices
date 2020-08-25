import Joi from "joi";
const schemas = {
  // schema for body
  blogPOST: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    year: Joi.number().required(),
  }),
  // schema for query params
  blogLIST: Joi.object().keys({
    page: Joi.number().required(),
    blogsPerPage: Joi.number().required(),
    text: Joi.string(),
  }),
  // schema for path params
  blogDETAIL: {
    id: Joi.number().min(1).required(),
  },
};
export default schemas;
