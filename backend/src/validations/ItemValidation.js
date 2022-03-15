const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const itemSchema = (data) => {
  const serviceType = ["dryCleaning", "tailoring"];
  Schema = Joi.object({
    name: Joi.string(),
    price: Joi.number().required(),

    serviceType: Joi.string()
      .trim()
      .valid(...Object.values(serviceType)),
  }).unknown();

  return Schema.validate(data);
};

module.exports = {
    itemSchema,
};
