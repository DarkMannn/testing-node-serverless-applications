const Joi = require('@hapi/joi');

const eventSchema = Joi.object({
    bucket: Joi.string().required(),
    key: Joi.string().required(),
    format: Joi.string().valid('png', 'webp', 'jpeg').default('png')
});

const extractEventObject = (sqsMessage) => sqsMessage.Records[0].body;

exports.parse = (sqsMessage) => {

    const eventObject = extractEventObject(sqsMessage);
    const { value: payload, error } = eventSchema.validate(eventObject);

    if (error) {
        throw Error(`Payload error => ${error}.`);
    }
    return payload;
};
