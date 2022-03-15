const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const customerSchema = (data) => {
  Schema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().trim().lowercase().email(),
    phoneNumber: Joi.string().trim(),
  }).unknown();

  return Schema.validate(data);
};

const locationSchema = (data) => {
  Schema = Joi.object({
    apartmentNo: Joi.string(),
    zipCode: Joi.string(),
    address: Joi.string(),
    nickName: Joi.string().trim(),
  }).unknown();

  return Schema.validate(data);
};

module.exports = {
    customerSchema,locationSchema
};
