const dataValidation = (schema, property) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req[property]);
      next();
    } catch (err) {
      const { details } = err;
      const message = details.map((i) => i.message).join(",");
      res.status(422).json({ error: message });
    }
  };
};

export default dataValidation;
