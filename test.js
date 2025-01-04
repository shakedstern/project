const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

describe('Event Routes (Unit Tests)', function () {
    let app;
    let Event;
    let findStub;
    let saveStub;
    let findByIdStub;
    let findByIdAndDeleteStub;

    before(async function () {
        const server = require('./api'); // Import inside before hook to ensure app setup
        app = server.app;
        Event = server.Event;
    });

    beforeEach(function () {
        // Stub Mongoose methods before each test
        findStub = sinon.stub(Event, 'find');
        saveStub = sinon.stub(Event.prototype, 'save');
        findByIdStub = sinon.stub(Event, 'findById');
        findByIdAndDeleteStub = sinon.stub(Event, 'findByIdAndDelete');
    });

    afterEach(() => {
        // Restore all stubs
        sinon.restore();
    });

    describe('GET /events', function () {
        it('responds with json and events array', async function () {
            const mockEvents = [{ title: "Event 1" }, { title: "Event 2" }];
            findStub.resolves(mockEvents);

            const res = await request(app)
                .get('/events')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body).to.be.an('array');
            expect(res.body).to.deep.equal(mockEvents);
            expect(findStub.calledOnce).to.be.true;
        });

        it('responds with 500 on error', async function () {
            findStub.rejects(new Error('Database error'));
            const res = await request(app).get('/events').expect(500);
            expect(res.body.message).to.equal('Error fetching events');
            expect(findStub.calledOnce).to.be.true;
        });
    });

    describe('POST /events', function () {
        it('creates a new event', async function () {
            const mockEvent = { title: "Test Event", description: "test description", location: "test location", status: "active", date: "2024-12-12T00:00:00.000Z" };
            saveStub.resolves(mockEvent);

            const res = await request(app)
                .post('/events')
                .set('Content-Type', 'application/json')
                .send({ title: "Test Event", description: "test description", location: "test location", date: "2024-12-12T00:00:00.000Z" })
                .expect(201);

            expect(res.body).to.be.an('object');
            expect(res.body).to.deep.include(mockEvent);
        });

        it('should return validation error if title is missing', async function () {
            const res = await request(app)
                .post('/events')
                .set('Content-Type', 'application/json')
                .send({ description: "test description", location: "test location", date: "2024-12-12" })
                .expect(400);
            expect(res.body.message).to.equal("Validation error");
            expect(res.body.details).to.include('"title" is required');
        });

        it('responds with 500 on error', async function () {
            saveStub.rejects(new Error('Database error'));
            const res = await request(app)
                .post('/events')
                .set('Content-Type', 'application/json')
                .send({ title: "Test Event", description: "test description", location: "test location", date: "2024-12-12" })
                .expect(500);
            expect(res.body.message).to.equal('Error saving event');
        });
    });

    describe('PUT /events/:id', function () {
        it('should handle all update scenarios', async function () {
            this.timeout(8000);
            // Scenario 1: Event not found (404)
            findByIdStub.resolves(null);
            let res = await request(app)
                .put('/events/nonExistentId')
                .send({ version: 0, title: 'Updated Title' })
                .expect(404);
            expect(res.body.message).to.equal('Event not found');

            // Scenario 2: Version conflict (409)
            findByIdStub.resolves({ _id: 'someId', version: 1 });
            res = await request(app)
                .put('/events/someId')
                .send({ version: 0, title: 'Updated Title' })
                .expect(409);
            expect(res.body.message).to.equal('Event has been updated by another user. Please refresh.');

            // Scenario 3: Successful update (200)
            const saveStub = sinon.stub().resolves(); // Simulating a successful save
            findByIdStub.resolves({ _id: 'someId', version: 0, save: saveStub });
            res = await request(app)
                .put('/events/someId')
                .send({ version: 0, title: 'Updated Title' })
                .expect(200);
            expect(res.body.title).to.equal('Updated Title');
            expect(res.body.version).to.equal(1);
            expect(saveStub.calledOnce).to.be.true;

            // Scenario 4: Save error (500)
            const saveStubReject = sinon.stub().rejects(new Error('Database error'));
            findByIdStub.resolves({ _id: 'someId', version: 0, save: saveStubReject });
            res = await request(app)
                .put('/events/someId')
                .send({ version: 0, title: 'Updated Title' })
                .expect(500);
            expect(res.body.message).to.equal('Error updating event');
        });
    });

    describe('DELETE /events/:id', function () {
        it('deletes an existing event', async function () {
            const mockEvent = {
                _id: "mockId",
                title: "Test Event",
                description: "test description",
                location: "test location",
                date: "2024-12-12T00:00:00.000Z",
            };

            findByIdAndDeleteStub.resolves(mockEvent);

            const res = await request(app)
                .delete('/events/mockId')
                .expect(200);

            expect(res.body.message).to.equal("Event deleted successfully");
            expect(findByIdAndDeleteStub.calledOnceWithExactly("mockId")).to.be.true;
        });

        it('responds with 404 if event not found', async function () {
            findByIdAndDeleteStub.resolves(null);

            const res = await request(app)
                .delete('/events/mockId')
                .expect(404);

            expect(res.body.message).to.equal("Event not found");
            expect(findByIdAndDeleteStub.calledOnceWithExactly("mockId")).to.be.true;
        });

        it('responds with 500 on error', async function () {
            findByIdAndDeleteStub.rejects(new Error("Database error"));

            const res = await request(app)
                .delete('/events/mockId')
                .expect(500);

            expect(res.body.message).to.equal("Error deleting event");
            expect(findByIdAndDeleteStub.calledOnceWithExactly("mockId")).to.be.true;
        });
    });
});
