const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const requestSchema = (data) => {
    const enumStatus = [
        'pending',
        'approve',
        'deny',
        'share',

    ];
    Schema = Joi.object({
        subject: Joi.string(),
        requester:Joi.objectId(),
        email: Joi.string().trim().lowercase().email(),
        zipCode: Joi.array(),
        from: Joi.string(),
        to: Joi.string(),
        description: Joi.string().trim().max(350),
        status: Joi.string()
            .trim()
            .valid(...Object.values(enumStatus)),
        userId: Joi.objectId(),
        jobId: Joi.objectId(),
    }).unknown();

  return Schema.validate(data);
};

module.exports = {
  requestSchema,
};
