const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const UserSchema = (data) => {
  const Schema = Joi.object({
    fID: Joi.string().trim(),
    firstName: Joi.string().trim().min(3).max(60).required(),
    lastName: Joi.string().trim().min(3).max(15),
    email: Joi.string().trim().lowercase().email(),
    vehicleNo: Joi.string().trim(),
    phoneNumber: Joi.string().trim(),
    description: Joi.string().max(350),
    serviceRegions: Joi.array(),
    note: Joi.string(),
    royaltyScheme: Joi.objectId(),
    address: Joi.string().required(),
    pricing: Joi.object().keys({
      serviceOne: Joi.number(),
      serviceTwo: Joi.number(),
      serviceThree: Joi.number(),
    }),
  }).unknown();

  return Schema.validate(data);
};

const LoginSchema = (data) => {
  const Schema = Joi.object({
    email: Joi.string().trim().lowercase().email(),

    password: Joi.string().pattern(
      new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    ),
  }).unknown();

  return Schema.validate(data);
};

const CustomerLoginSchema = (data) => {
  const Schema = Joi.object({
    email: Joi.string().trim().lowercase().email(),

    password: Joi.string(),
  }).unknown();

  return Schema.validate(data);
};

module.exports = { UserSchema, LoginSchema, CustomerLoginSchema };
