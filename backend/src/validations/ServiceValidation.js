const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const serviceSchema = (data) => {
   
    Schema = Joi.object({
        price: Joi.number().required(),
       
    }).unknown();

    return Schema.validate(data);
};

module.exports = {
    serviceSchema,
};