var expect = require("chai").expect;
var app = require('../app/app');
var api = require('supertest')(app);
var models = require('../app/models');


describe("API", function(){

    /**
     * Ensure that we using test database
     * */
    before(function(done){
        models.init(function() {
            return (models.isTestDB()) ? done() : done("Not test database! Set env variable TEST=true");
        })
    });

    it("1 + 1 = 2, and not 3 (dummy test)", function() {
        expect(1+1).to.equal(2);
        expect(1+1).to.not.equal(3);
    });

    it('ping should respond with pong', function(done) {
        api.get('/ping/ping')
            .expect(200, 'pong', done)
    });

    describe("Events", function(){

        /**
         * Before making any requests to Events API, we need to make sure that license key and domain
         * are presented in DB. License key and domain validation will be tested separately.
         * */
        before(function(done){
            api.post('/api/license_key')
                .send({
                    "access_token": "gE216KPqDIjGxu6uSTpO",
                    "license_key": "6ee7f16ef224e0ba13a22de8e2be2bb8",
                    "domains": ["http://inboundsoon.dev"]
                })
                .expect(200, "OK", done)
        });

        beforeEach(function(done){
            models.events.remove({}, done);
        });

        it("POST request with invalid event should return 400", function(done) {
            api.post('/api/events')
                .send({a: 1})
                .expect('Content-Type', /application\/json/)
                .expect(400, function() {
                    models.events.count({}, {}, function (err, result) {
                        if (err) {
                            done(err);
                        }
                        expect(result).equal(0);
                        done();
                    });
                })
        });

        it("GET request with invalid event should return 400", function(done) {
            api.get('/api/events?a=1')
                .expect('Content-Type', /application\/json/)
                .expect(400, function() {
                    models.events.count({}, {}, function (err, result) {
                        if (err) {
                            done(err);
                        }
                        expect(result).equal(0);
                        done();
                    });
                })
        });

        it("POST request with valid event should return 200", function(done) {
            api.post('/api/events')
                .send({
                    "license_key" : "6ee7f16ef224e0ba13a22de8e2be2bb8",
                    "wordpress_url" : "http://inboundsoon.dev",
                    "content_id" : "95897",
                    "lead_id" : "95901",
                    "lead_uid" : "Z6ATMIGrPooZ0nWT2hoxS1MqA12XqPDCdSg",
                    "event_type" : "form_submission"
                })
                .expect('Content-Type', /text/)
                .expect(200, "OK", function() {
                    models.events.count({}, {}, function (err, result) {
                        if (err) {
                            done(err);
                        }
                        expect(result).equal(1);
                        done();
                    });
                })
        });

        it("GET request with valid event should return 200", function(done) {
            api.get('/api/events?' +
                    'license_key=6ee7f16ef224e0ba13a22de8e2be2bb8&' +
                    'wordpress_url=http://inboundsoon.dev&' +
                    'content_id=95897&' +
                    'lead_id=95901&' +
                    'lead_uid=Z6ATMIGrPooZ0nWT2hoxS1MqA12XqPDCdSg&' +
                    'event_type=form_submission')
                .expect('Content-Type', /text/)
                .expect(200, "OK", function() {
                    models.events.count({}, {}, function (err, result) {
                        if (err) {
                            done(err);
                        }
                        expect(result).equal(1);
                        done();
                    });
                })
        });
    });


});