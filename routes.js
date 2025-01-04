const express = require('express');
const mongoose = require('mongoose');
const {eventValidationSchema, updateEventValidationSchema, queryValidationSchema } = require('./eventValidators');
const { Event } = require('./models');

const router = express.Router();

// Middleware for validation
const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).send({
            message: 'Validation error',
            details: error.details.map((detail) => detail.message),
        });
    }
    next();
};

// Middleware for query validation
const validateQuery = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
        return res.status(400).send({
            message: 'Validation error',
            details: error.details.map((detail) => detail.message),
        });
    }
    next();
};

// Update an event (with optimistic locking, WITHOUT transaction)
router.put('/events/:id', validateRequest(updateEventValidationSchema), async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        if (event.version !== req.body.version) {
            return res.status(409).send({ message: 'Event has been updated by another user. Please refresh.' });
        }

        Object.assign(event, req.body);
        event.version += 1;
        await event.save({ session });
        await session.commitTransaction();
        res.send(event);
    } catch (err) {
        await session.abortTransaction();
        console.error('Error updating event:', err);
        res.status(500).send({ message: 'Error updating event' });
    } finally {
        session.endSession();
    }
});

// Create an event
router.post('/events', validateRequest(eventValidationSchema), async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const event = new Event(req.body);
        const savedEvent = await event.save({ session });
        await session.commitTransaction();
        res.status(201).send(savedEvent);
    } catch (err) {
        await session.abortTransaction();
        console.error('Error saving event:', err);
        res.status(500).send({ message: 'Error saving event' });
    } finally {
        session.endSession();
    }
});

// Get all events with filters
router.get('/events', validateQuery(queryValidationSchema), async (req, res) => {
    const { location, date, status } = req.query;
    try {
        const query = {};
        if (location) query.location = location;
        if (date) query.date = new Date(date);
        if (status) query.status = status;

        const events = await Event.find(query);
        res.send(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).send({ message: 'Error fetching events' });
    }
});

// Delete an event (WITHOUT transaction)
router.delete('/events/:id', async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).send({ message: 'Event not found' });
        }

        await session.commitTransaction();
        res.send({ message: 'Event deleted successfully' });
    } catch (err) {
        await session.abortTransaction();
        console.error('Error deleting event:', err);
        res.status(500).send({ message: 'Error deleting event' });
    } finally {
        session.endSession();
    }
});

module.exports = router;
