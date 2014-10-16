// https://gist.github.com/Fabryz/2493656
var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  async = require('async'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var app = express();

require('./config/express')(app, config);

console.log("3000");
app.listen(config.port);

