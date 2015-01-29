// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var fs = require('fs');

var app = express();

require("node-jsx").install({extension: '.jsx', harmony: true});

var path = require('path');
var ConnectRoles = require('connect-roles');

var port = 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'),
lusca = require('lusca');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration


// create a write stream (in append mode)
//var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})

// setup the logger
//app.use(morgan('combined', {stream: accessLogStream}))

// set up our express application
app.use(morgan('dev')); // log every request to the console



app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'build')));

app.set('views', path.join(__dirname, './src/app/views'));
app.set('view engine', 'ejs'); // set up ejs for templating

app.set('nodeRootDirStr', __dirname);

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch',
    /* secure cookies */
    cookie: { httpOnly: true }
}));

/**
 * Security modules
 */
//app.use(lusca.csrf()); // todo: token in dom http://bit.ly/13NO8XC
//app.use(lusca.csp({ /* ... */})); // Enables Content Security Policy (CSP) headers.
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.p3p('LDJASSAJ'));
app.use(lusca.hsts({ maxAge: 31536000 })); // forces https everything
app.use(lusca.xssProtection(true));
/* end security modules */

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


var roles = new ConnectRoles({
  failureHandler: function (req, res, action) {
      res.json({"error": "Invalid Role"});

  }
});

app.use(roles.middleware());

// Set up Routes for the application
require('./src/app/routes/coreroutes.js')(app, passport);
require('./src/app/routes/appRoutes.js')(app, passport);
require('./src/app/routes/unlinkroutes.js')(app, passport);
require('./src/app/routes/connectroutes.js')(app, passport);

//Route not found -- Send error/not found page
app.get('*', function(req, res) {
    res.json({
        "route": "does not exist!"
    });
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);