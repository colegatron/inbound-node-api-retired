'use strict';

/* load middleware */
var StripeWebhook = require('stripe-webhook-middleware'),
isAuthenticated = require('./middleware/auth').isAuthenticated,
isUnauthenticated = require('./middleware/auth').isUnauthenticated,
setRender = require('middleware-responder').setRender,
setRedirect = require('middleware-responder').setRedirect,
stripeEvents = require('./middleware/stripe-events'),
secrets = require('./config/secrets'),
proDownload = require('./middleware/plugin-updater'),
exec = require('exec'),
passport = require('passport'),
spawn = require('child_process').spawn;


/* load react addons & components */
var React = require('react/addons');
var App = React.createFactory(require('./components/main.jsx'));


/* require controllers */
var users = require('./controllers/users-controller'),
main = require('./controllers/main-controller'),
dashboard = require('./controllers/dashboard-controller'),
passwords = require('./controllers/passwords-controller'),
registrations = require('./controllers/registrations-controller'),
sessions = require('./controllers/sessions-controller'),
handle_404 = require('./controllers/404-controller');

/* require models */
var User = require('./models/user');
var Transient = require('./models/transient-cache');

var stripeWebhook = new StripeWebhook({
    stripeApiKey: secrets.stripeOptions.apiKey,
    respond: true
});


module.exports = function (app, passport) {

    // homepage and dashboard
    app.get('/',
        setRedirect({auth: '/dashboard'}),
        isUnauthenticated,
        setRender('index'),
        main.getHome
    );

    // sessions
    app.get('/login',
        setRedirect({auth: '/dashboard'}),
        isUnauthenticated,
        setRender('login'),
        main.getHome
    );

    app.post('/login',
        setRedirect({auth: '/dashboard', success: '/dashboard', failure: '/'}),
        isUnauthenticated,
        sessions.postLogin
    );

    app.get('/logout',
        setRedirect({auth: '/', success: '/'}),
        isAuthenticated,
        sessions.logout
    );

    // registrations
    app.get('/signup',
        setRedirect({auth: '/dashboard'}),
        isUnauthenticated,
        setRender('signup'),
        registrations.getSignup
    );

    app.post('/signup',
        setRedirect({auth: '/dashboard', success: '/dashboard', failure: '/signup'}),
        isUnauthenticated,
        registrations.postSignup
    );

    // forgot password
    app.get('/forgot',
        setRedirect({auth: '/dashboard'}),
        isUnauthenticated,
        setRender('forgot'),
        passwords.getForgotPassword
    );

    app.post('/forgot',
        setRedirect({auth: '/dashboard', success: '/forgot', failure: '/forgot'}),
        isUnauthenticated,
        passwords.postForgotPassword
    );

    // reset tokens
    app.get('/reset/:token',
        setRedirect({auth: '/dashboard', failure: '/forgot'}),
        isUnauthenticated,
        setRender('reset'),
        passwords.getToken
    );

    app.post('/reset/:token',
        setRedirect({auth: '/dashboard', success: '/dashboard', failure: 'back'}),
        isUnauthenticated,
        passwords.postToken
    );

    app.get('/dashboard',
        setRender('dashboard/index'),
        setRedirect({auth: '/'}),
        isAuthenticated,
        dashboard.getDefault
    );

    app.get('/billing',
        setRender('dashboard/billing'),
        setRedirect({auth: '/'}),
        isAuthenticated,
        dashboard.getBilling
    );
    app.get('/profile',
        setRender('dashboard/profile'),
        setRedirect({auth: '/'}),
        isAuthenticated,
        dashboard.getProfile
    );


    // user api stuff
    app.post('/user',
        setRedirect({auth: '/', success: '/profile', failure: '/profile'}),
        isAuthenticated,
        users.postProfile
    );

    app.post('/user/billing',
        setRedirect({auth: '/', success: '/billing', failure: '/billing'}),
        isAuthenticated,
        users.postBilling
    );

    app.post('/user/plan',
        setRedirect({auth: '/', success: '/billing', failure: '/billing'}),
        isAuthenticated,
        users.postPlan
    );

    app.post('/user/password',
        setRedirect({auth: '/', success: '/profile', failure: '/profile'}),
        isAuthenticated,
        passwords.postNewPassword
    );

    app.post('/user/delete',
        setRedirect({auth: '/', success: '/'}),
        isAuthenticated,
        users.deleteAccount
    );

    // use this url to receive stripe webhook events
    app.post('/stripe/events',
        stripeWebhook.middleware,
        stripeEvents
    );

    app.get('/react', function(req, res, next) {
        /*
        console.log("\n\n\n\n");
        console.log("react-------------------------------------");
        console.log("req.query.title = " + req.query.title);
        console.log("req.query.url = " + req.query.url);
        console.log("req.query.description = " + req.query.description);
        console.log("react-------------------------------------");
        */
        var myAppHtml = React.renderToString(App({}));
        res.render('react', {reactOutput: myAppHtml});
    });

    //Route for processing Referral
    app.get('/ref/:refid', function(req, res, next){
        //console.log("req.params.refid = " + req.params.refid);
        res.clearCookie('affliateReferredById');
        res.cookie('affliateReferredById', req.params.refid, { expires: new Date(Date.now() + 900000)});
        res.redirect('/signup');
    });

    app.get('/reminders/create', function(req, res, next) {

        res.render('create-reminder', {});
    });

    // Route for Chrome Extension Pop-Up
     app.get('/chromelogin', function(req, res, next) {
        res.render('chromelogin');
    });

    app.post('/chromelogin', function(req, res, next) {
            var urlStr = "";
            urlStr = urlStr + "title=";
            urlStr = urlStr + req.cookies.chromeexttitle;
            urlStr = urlStr + "&";
            urlStr = urlStr + "url=";
            urlStr = urlStr + req.cookies.chromeexturl;
            urlStr = urlStr + "&";
            urlStr = urlStr + "description=";
            urlStr = urlStr + req.cookies.chromeextdescription;

            var route1Str = "/react?";
            var route2Str = "/chromelogin";

            route1Str = route1Str + urlStr;
            //route2Str = route2Str + urlStr;

            passport.authenticate('login', {
                successRedirect: route1Str,
                failureRedirect: route2Str,
                failureFlash : true
            })(req, res, next);
    });

    /**
     * Add endpoint processing
     */
    app.get('/chromeext', function(req, res, next) {
         /*
            console.log("\n\n\n\n");
            console.log("*********chromeext-------------------------------------");
            console.log("*********req.query.title = " + req.query.title);
            console.log("*********req.query.url = " + req.query.url);
            console.log("*********req.query.description = " + req.query.description);
            console.log("chromeext-------------------------------------");
            console.log("req.query = " + req.query);
            console.log("-------------------------------------");
        */

        res.clearCookie('chromeexttitle');
        res.clearCookie('chromeexturl');
        res.clearCookie('chromeextdescription');

        res.cookie('chromeexttitle', req.query.title, { expires: new Date(Date.now() + 900000)});
        res.cookie('chromeexturl', req.query.url, { expires: new Date(Date.now() + 900000)});
        res.cookie('chromeextdescription', req.query.description, { expires: new Date(Date.now() + 900000)});

        var urlStr = "";
        urlStr = urlStr + "title=";
        urlStr = urlStr + req.query.title;
        urlStr = urlStr + "&";
        urlStr = urlStr + "url=";
        urlStr = urlStr + req.query.url;
        urlStr = urlStr + "&";
        urlStr = urlStr + "description=";
        urlStr = urlStr + req.query.description;

        var route1Str = "/react?";
        var route2Str = "/chromelogin";

        route1Str = route1Str + urlStr;
        //route2Str = route2Str + urlStr;

        if( req.user ){
            res.redirect(route1Str);
        }else{
            res.redirect(route2Str);
        }
    });

    /**
     * Gets host name from url
     * @param url
     * @returns {*}
     */
    function getHostName(url) {
        var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 &&
                typeof match[2] === 'string' && match[2].length > 0) {
                 return match[2];
        }
        else {
            return url;
        }
    }

    /**
     * Checks for both POST & GET for params
     * @param req
     */
    function getRequestParam( req , key ) {

        if ( typeof req.body[key] != 'undefined' ) {
            return  req.body[key];
        }

        if ( typeof req.query[key] != 'undefined' ) {
            return req.query[key];
        }

        return '';
    }

    /**
     * Checks to see if API Key is valid
     * @param req
     * @param res
     * @param next
     */
    function isValidApiKey(req, res, next) {

         var key = getRequestParam( req , 'api');
         var site = getRequestParam( req , 'site');

         if (key) {
             User.findOne({
                 'api_pubKey': key
             }, function(err, user) {

                 if (err) {
                         res.json({'error': 'db error'});
                 }

                 if (!user) {

                     res.json({'error': 'invalid api key'});

                 } else {
                     // check for domain match
                     var plan = user.stripe.plan;
                     if (plan === "free") {
                            // free plan bail
                     }
                     var userSite = getHostName(user.profile.website);
                     userSite = userSite.replace('http://','');
                     userSite = userSite.replace('https://','');
                     site = site.replace('http://','');
                     site = site.replace('https://','');

                     if(userSite === site && typeof(site) != "undefined") {
                         return next();
                     } else {
                         res.json({'error': 'Site domain '+userSite+' doesnt match '+site+'. Make sure you set your Website URL on http://api.inboundnow.com/profile.'});
                     }

                 }
             });
        } else {
         res.json({'error': 'no API key provided. Please set your API key in settings'});
        }
    }

    /**
     * Endpoint to get information about the inbound pro plugin that can be used by user's client
     */
    app.get('/api/pro/info', isValidApiKey, function(req, res) {
        var json =  proDownload.getJsonObject( getRequestParam( req , 'api') , getRequestParam( req , 'site') )
        res.json(json);
    });

    /**
     * Endpoint to get download zip file
     */
    app.get('/api/pro/zip', isValidApiKey, function(req, res) {
        var file = './server/files/inbound-pro.zip';
        res.set('Content-Type', 'application/zip');
        res.download(file , 'inbound-pro.zip' , function(err){
            if (err) {
                // Handle error, but keep in mind the response may be partially-sent
                // so check res.headersSent
            } else {
                // decrement a download credit, etc.
            }
        });
    });

    /**
     * Endpoint to get download zip
     */
    app.post('/api/downloads/zip', isValidApiKey, function(req, res) {
        var slug = req.body.filename;
        var type = req.body.type;

        res.json({
            'apikey': true,
            'url': 'http://www.hudsonatwell.co/inboundnow/gitservlet.php?giturl=https://bitbucket.org/inboundnow/'+slug+'/get/master.zip'
        });
    });

    /**
     * Endpoint to check if license key is valid
     */
    app.post('/api/key/check', isValidApiKey, function(req, res) {
        res.json({
            'apikey': true
        });
    });

    /* logged in 404 */
    app.get('/404-error', function(req, res) {
         res.render('dashboard/404', {});
    });

    /* All other 404s */
    app.get('*',
        setRedirect({auth: '/404-error'}),
        isUnauthenticated,
        setRender('404'),
        handle_404.get404
    );


};