import Joi from "joi";
const schemas = {
  partPOST: Joi.object().keys({
    partno: Joi.string().required(),
    name: Joi.string().required(),
    qty: Joi.number().required(),
    cost: Joi.number().required(),
    price: Joi.number().required(),
  }),
  partLIST: Joi.object().keys({
    page: Joi.number().required(),
    partsPerPage: Joi.number().required(),
  }),
};
export default schemas;
