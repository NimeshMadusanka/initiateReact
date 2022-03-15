const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const RoyaltySchema = (data) => {
  const Schema = Joi.object({
    scheme_Name: Joi.string(),
    schemeID: Joi.string(),
    royalty_Percentage: Joi.number(),
    status: Joi.boolean(),
  }).unknown();

  return Schema.validate(data);
};
module.exports = { RoyaltySchema };
