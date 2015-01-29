var views = require("./views"),
    validate = require("./validate"),
    jwtAuth = require("./jwtauth");

exports = module.exports = function(app) {

    /**
     * API requests
     * */
    app.post('/api/events', [validate, views.addEvent]);
    app.get('/api/events', [validate, views.addEvent]);
    app.get('/api/count_events', [jwtAuth.checkToken, views.countEvents]);
    app.get('/api/list_events', [jwtAuth.checkToken, views.listEvents]);
    app.post('/api/license_key', [jwtAuth.checkToken, jwtAuth.requireSuperuser, views.licenseKey]);

    // obtain JWT
    app.post('/token', jwtAuth.getToken);

    /**
     * Test requests
     * */
    app.get('/ping/ping', views.ping);
    app.get('/ping/error', views.error);
    app.get('/ping/jwt', [jwtAuth.checkToken, jwtAuth.requireAuth, views.jwtTest]);
    app.post('/ping/jwt', [jwtAuth.checkToken, jwtAuth.requireAuth, views.jwtTest]);

};