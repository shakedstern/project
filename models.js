const mongoose = require('mongoose');
const Joi = require('joi');

// Define Event model with version field
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, maxlength: 500 },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['active', 'cancelled', 'done'], default: 'active' },
    version: { type: Number, default: 0 }, // Version field for optimistic locking
});

const Event = mongoose.model('Event', EventSchema);



module.exports = {
    Event
};
