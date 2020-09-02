import Joi from "joi";
const schemas = {
  productPOST: Joi.object().keys({
    name: Joi.string().required(),
    manufacturer: Joi.string().required(),
    catalog_number: Joi.number().required(),
    parts: Joi.array(),
  }),
  productLIST: Joi.object().keys({
    page: Joi.number().required(),
    productsPerPage: Joi.number().required(),
  }),
  productDETAIL: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
export default schemas;
