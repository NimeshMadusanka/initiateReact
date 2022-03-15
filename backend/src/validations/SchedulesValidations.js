const Joi = require("joi").extend(require("@joi/date"));
Joi.objectId = require("joi-objectid")(Joi);

const scheduleCreateValidation = (data) => {
  const Schema = Joi.object({
    zone: Joi.objectId().required(),
    startDate: Joi.date().format("YYYY-MM-DD").raw().required(),
    endDate: Joi.date().format("YYYY-MM-DD").raw().allow(null),
    timeSlots: Joi.array().items(
      Joi.object({
        id: Joi.objectId().required(),
        limit: Joi.number().required(),
      })
    ),
    unattendedLimit: Joi.number().required(),
    isPublished: Joi.boolean(),
  }).unknown();

  return Schema.validate(data);
};
const scheduleUpdateValidation = (data) => {
  const Schema = Joi.object({
    timeSlots: Joi.array().items(
      Joi.object({
        id: Joi.objectId().required(),
        limit: Joi.number().required(),
      })
    ),
    unattendedLimit: Joi.number().required(),
    isPublished: Joi.boolean(),
  }).unknown();

  return Schema.validate(data);
};

const timeSlotCreateValidation = (data) => {
  const Schema = Joi.object({
    zone: Joi.objectId().required(),
    limit: Joi.number().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    isPublished: Joi.boolean().required(),
  }).unknown();

  return Schema.validate(data);
};

const scheduleLimitUpdateValidation = (data) => {
  const Schema = Joi.object({
    timeSlots: Joi.array().items(
      Joi.object({
        id: Joi.objectId().required(),
        count: Joi.number().min(1).max(1).required(),
      })
    ),
    unattendedCount: Joi.number().min(1).max(1),
  }).unknown();

  return Schema.validate(data);
};
module.exports = { 
  timeSlotCreateValidation, 
  scheduleCreateValidation,
  scheduleUpdateValidation,
  scheduleLimitUpdateValidation 
};
