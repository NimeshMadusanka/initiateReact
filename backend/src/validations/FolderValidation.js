const Joi = require('joi');

const FolderSchema = (data) => {
  const Schema = Joi.object({
    name: Joi.string().trim().min(1).max(35)
      .required(),
  }).unknown();

  return Schema.validate(data);
};
module.exports = { FolderSchema };
