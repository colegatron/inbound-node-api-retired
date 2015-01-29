var MongoClient = require('mongodb').MongoClient;

var mongoURI =  (process.env.NODE_ENV !== undefined)
    ? 'mongodb://nodejitsu:42b8867ad0b8163a658b3f40818642a6@troup.mongohq.com:10091/nodejitsudb6539712769'
    : 'mongodb://127.0.0.1:27017/jax';

var exports = {
    // initialize connection with MongoDB, this function should be executed before starting express server
    init: function (callback){

        var actualURI = (process.env.TEST) ? mongoURI + "_test" :  mongoURI;
        console.log("Connecting to " + actualURI);
        MongoClient.connect(actualURI, function (err, newDb) {
            if (err) return callback(err);

            // events is MongoDB collection where we store raw data
            exports.events = newDb.collection('events');
            exports.events.createIndex({"license_key": 1, "dt": 1}, callback);

            /**
             * license_keys is mapping that match license key to array of domains.
             * Domains are encrypted in the same way as JSON Web Tokens
             * */
            exports.license_keys = newDb.collection('license_keys');
        });
    },
    /**
     * This function is used it tests, before any opertations with DB is done.
     * In this manner we can make sure that we will not corrupt data in main DB.
     * */
    isTestDB: function(){
        return /_test$/.test(exports.events.db.databaseName);
    },
    // initialised in init function
    events: undefined,
    license_keys: undefined
};

module.exports = exports;