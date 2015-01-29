var JaySchema = require('jayschema');
var js = new JaySchema();
var models = require('./models');
var jwtAuth = require("./jwtauth");

/* Basis schema for all events.  */
var basicSchema = {
    type: "object",
    properties: {
        license_key: { type: "string"},
        wordpress_url: { type: "string"},
        content_id: {type: "string"},
        lead_id: {type: "string"},
        lead_uid: {type: "string"},
        dt: {type: "object"},
        event_type: {type: "string"}
    },
    required: [
        "license_key",
        "wordpress_url",
        "content_id",
        "lead_id",
        "event_type",
        "dt"
    ],
    "additionalProperties": true
};

/* validate event against schema. It will return array with objects in case of errors, and empty array otherwise */
module.exports = function(req, res, next) {
    console.log("Event validation");
    var event = (req.method == "GET") ? req.query : req.body;
    // populate event with current timestamp before saving
    event.dt = new Date(Date.now());
    // perform schema validation of events before saving
    err = js.validate(event, basicSchema);
    // return 400 in case of error
    if (err.length > 0) {
        return res.json(400, err)
    }

    // validate license key and domain
    models.license_keys.findOne({_id: event.license_key}, function(err, document) {
        // this license key is not presented in DB
        if (err || !document) {
            return res.send('License key not found', 401)
        }

        var domains = jwtAuth.decodeToken(document.domains);
        if (domains.indexOf(event.wordpress_url) < 0) {
            return res.send('This domain is not registered for this license key', 401)
        }

        //everything is OK, populate req.event and pass it to the next function
        req.event = event;
        next()
    });
};