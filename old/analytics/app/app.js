#!/bin/env node
var express = require('express'),
    async = require('async'),
    cors = require('cors'),
    models = require('./models');

var app = express();
app.use(cors());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.favicon());
app.use("/reports", express.static(__dirname + '/reports'));

app.port = 8080;
app.ipaddress = '127.0.0.1';

require('./routes')(app);

app.configure('development', function(){
    console.log("Applying development settings");
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
    console.log("Applying production settings");
    app.use(express.errorHandler());
});

async.series([
        // initialize DB module
        models.init,
        // start web server
        function(callback) { app.listen(app.port, app.ipaddress, callback)}
    ],
    function(err){
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('%s: Node server started on %s:%d ...',
            new Date(Date.now()), app.ipaddress, app.port);
    }

);

module.exports = app;