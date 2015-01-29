var models = require('./models'),
    url = require('url'),
    jwtAuth = require("./jwtauth");


module.exports = {
    /**
     * Heartbeat endpoint which is used to understand that Node worker is alive
     * */
    ping: function (req, res) {
        console.log("Ping request");
        res.send("pong");
    },


    /**
     * Produces an error on server side. It is used to test error handling
     * */
    error: function () {
        console.error("Error request");
        throw new Error();
        //res.send("Not reachable");
    },


    /**
     * Receive new event and store it in Mongomodels
     * */
    addEvent: function (req, res) {
        console.log("Adding event");
        // req.events was created on validation step
        models.events.insert(req.event, function (err) {
            if (err) {
                console.error(err);
                return res.send(500, err);
            }
            res.send('OK');
        });
    },


    /**
     * Count events, with pagination. Query params:
     *  * license_key - (required) filter events by license key
     *  * skip - (optional) skip first N days, positive number > 0, default is 0
     *  * per_days - (optional) return data of that N days, positive number > 0, default is 7
     *  * lead_id -  (optional) additional filtering by lead ID
     *  * content_id -  (optional) additional filtering by content ID
     */
    countEvents: function(req, res) {
        console.log("Count events");
        var query = url.parse(req.url, true).query;

        // license key is the only required param, but not for superuser
        if (!query.license_key &&
            !(req.user && req.user.username == 'admin')) {
            return res.send(400, "license_key is required")
        }

        var q = parseQuery(query);
        models.events.count(q, {}, function (err, result) {
            if (err) {
                console.error(err);
                return res.json(500, {error: err});
            }
            return res.json({count_events: result});
        });
    },


    /**
     * List events with pagination. Query params:
     *  * license_key - (required) filter events by license key
     *  * skip - (optional) skip first N days, positive number > 0, default is 0
     *  * per_days - (optional) return data of that N days, positive number > 0, default is 7
     *  * lead_id -  (optional) additional filtering by lead ID
     *  * content_id -  (optional) additional filtering by content ID
     */
    listEvents: function(req, res) {
        console.log("Find events");
        var query = url.parse(req.url, true).query;

        // license key is the only required param, but not for superuser
        if (!query.license_key &&
            !(req.user && req.user.username == 'admin')) {
            return res.send(400, "license_key is required")
        }

        var q = parseQuery(query);
        // sorting by {dt: -1} will return all events in reverse order of their creation. Newer
        // events will come first.
        models.events.find(q).sort({$dt: -1}).toArray(function (err, result) {
            if (err) {
                console.error(err);
                return res.send(500, err);
            }
            return res.json(result);
        });
    },

    /**
     * Test endpoint for requests with JWT
     * */
    jwtTest: function(req, res){
        res.send('Hello ' + req.user.username)
    },

    /**
     * Add/Update information about license key and domains
     * */
    licenseKey: function(req, res){

        var license_key = req.body.license_key;
        var domains = req.body.domains;
        if (!license_key || !domains || typeof license_key != "string" || !(domains instanceof Array)) {
            return res.send(400, "license_key(string) and domains(array of strings) are required")
        }
        var encoded = jwtAuth.encodeToken(domains);
        models.license_keys.update(
            {_id: license_key},
            {_id: license_key, domains: encoded},
            {upsert: true},
            function(err){
                if (err) {
                    console.error(err);
                    return res.send(500, err);
                }
                return res.send("OK");
            }
        )
    }
};


/*
 * Build MongoDB query object from request params
 * */
function parseQuery(query) {

    // extract date range from request params
    var skip = (Number(query.skip) && Number(query.skip) > 0) ? Number(query.skip) : 0;
    var per_days = (Number(query.per_days) && Number(query.per_days) > 0) ? Number(query.per_days) : 7;
    var now = new Date(Date.now());
    now.setDate(now.getDate() - skip);
    var end_dt = new Date(now);
    now.setDate(now.getDate() - per_days);
    var start_dt = new Date(now);

    // create basic MongoDB query object with dt range and license key. Other filters are optional.
    var mongoQuery = {
        dt: {$gte: start_dt, $lt: end_dt}
    };
    if (query.license_key)  mongoQuery.license_key = query.license_key;
    // lead_id and content_id are optional. Add them to mongo query if they are presented
    if (query.lead_id)  mongoQuery.lead_id = query.lead_id;
    if (query.content_id)  mongoQuery.content_id = query.content_id;

    return mongoQuery;
}
