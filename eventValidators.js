const Joi = require('joi');
// Joi validation schemas
const eventValidationSchema = Joi.object({
    title: Joi.string().required().messages({ 'string.empty': 'Title is required' }),
    description: Joi.string().max(500).messages({ 'string.max': 'Description cannot exceed 500 characters' }),
    location: Joi.string().required().messages({ 'string.empty': 'Location is required' }),
    date: Joi.date().iso().required().messages({ 'date.base': 'Date is invalid or missing' }),
    status: Joi.string().valid('active', 'cancelled', 'done').default('active'),
});

const updateEventValidationSchema = Joi.object({
    title: Joi.string().messages({ 'string.empty': 'Title is required' }),
    description: Joi.string().max(500).messages({ 'string.max': 'Description cannot exceed 500 characters' }),
    location: Joi.string().messages({ 'string.empty': 'Location is required' }),
    date: Joi.date().messages({ 'date.base': 'Date is invalid or missing' }),
    status: Joi.string().valid('active', 'cancelled', 'done').default('active'),
    version: Joi.number().required().messages({ 'number.base': 'Version is required' }),
});

const queryValidationSchema = Joi.object({
    location: Joi.string().optional().max(50),
    date: Joi.date().optional(),
    status: Joi.string().optional().valid('active', 'cancelled', 'done'),
});

module.exports = {
    eventValidationSchema,
    updateEventValidationSchema,
    queryValidationSchema

};