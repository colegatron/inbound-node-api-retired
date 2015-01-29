/** @jsx React.DOM */
var React = require('react/addons');
var User = require('../models/user');
var App = React.createFactory(require('../components/main.jsx'));
var path = require('path');
var fs = require('fs');
var request = require('request');

var requireRole = function(role) {
  return function(req, res, next) {
    console.log("User = " + req.user);
    //if('user' in req.session && req.session.user.userRole === role)
    if(req.user){
        if(req.user.userRole === role){
            next();
        }else{
            res.json({
                "route": "you do not have acess to this route"
            });
        }
    }else{
        res.redirect('/');
    }
  }
};

//> db.users.update({email:"a@b.com"}, {$set: {userRole:"admin"}})
//app.get('/forums', forum.index);
//app.get('/forums/:id', forum.show);
//app.post('/forums', requireRole('moderator'), forum.create); // Only moderators can create forums
//app.delete('/forums/:id', requireRole('admin'), forum.destroy); // Only admins can delete forums

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

// route middleware to ensure user is logged in
function isValidApiKey(req, res, next) {
    var key = req.query.api;
    if (key) {
        User.findOne({
            'apiKey': key
        }, function(err, user) {
            // if there are any errors, return the error
            console.log(user)
            if (err) {
                res.json({'error': 'db error'});

            }
            if (!user) {
                res.json({'error': 'no user'});

            } else {
                return next();
            }
        });
    } else {
    	res.redirect('/');
    }
}


module.exports = function(app, passport) {

	//app.get('/editor', isLoggedIn, function(req, res){ for live
	app.get('/app', function(req, res){
		var myAppHtml = React.renderToString(App({}));
		//console.log(myAppHtml);
		//console.log("---------------------------------------------");
    	//console.log("---------------------------------------------");
	    res.render('app.ejs', {reactOutput: myAppHtml});
	});

	app.get('/editme', function(req, res){
        res.json({"editme": "Display Editor"});
    });

    function getFileContent(srcPath, callback) {
    fs.readFile(srcPath, 'utf8', function (err, data) {
        if (err) throw err;
        callback(data);
        }
      );
    }

    function copyFileContent(srcPath) {
        getFileContent(srcPath, function(data) {
            data = data.replace(' replace ', " some changed data");
            fs.writeFile (srcPath, data, function(err) {
                if (err) throw err;
                console.log('complete');
            });
        });
    }

    function createCSS(dFileStr, callback){
        fs.exists(dFileStr, function (exists) {
             if(!exists){
                fs.writeFile(dFileStr, ' replace me replace hehehehehe', function (err) {
                  if (err) throw err;
                    console.log('It\'s saved!');
                    callback(dFileStr);
                });
             } else {
                callback(dFileStr);
             }
        });
    }

    app.get('/saveme', function(req, res){
        var dObj = "";
        var d = req.params.foo;
        var dFileStr = path.join(app.get("nodeRootDirStr"), 'build/userdata/u2.txt');
        console.log(dFileStr);
        createCSS(dFileStr, copyFileContent)
        res.json({"save": "Data Saved!!!!"});
        /*
            1. Check if current user has any previous saved CSS files
            2a. If they do have current files that are living in the CDN, update the remote CDN with new file contents and save the old version locally like userID-1-27-2015.css
            2b. If they do not have a CDN file in their profile, pipe the saved data to AWS and return the link and add it to their profile.
        */
    });

    app.get('/testrole1', requireRole("default"), function(req, res){
        res.json({"testrole1": "Success!"});
    });

    app.get('/testrole2', requireRole("admin"), function(req, res){
        res.json({"testrole2": "Success!"});
    });

    app.get('/stripe', function(req, res){
        res.render('stripe.ejs');
    });

    app.post('/charge', function(req, res) {
        var stripeToken = req.body.stripeToken;
        var charge = stripe.charges.create({
            amount: 1000, // amount in cents, again
            currency: "usd",
            card: stripeToken,
            description: "payinguser@example.com"
        }, function(err, charge) {
            if (err && err.type === 'StripeCardError') {
                // The card has been declined
            } else {
                //Render a thank you page called "Charge"
                res.render('charge.ejs');
            }
        });
    });


};

