
'use strict';

var reminders = require('./controllers/reminder-controller.js');
var mongoose = require('mongoose');
var isAuthenticated = require('./middleware/auth').isAuthenticated;
var isUnauthenticated = require('./middleware/auth').isUnauthenticated;
var setRender = require('middleware-responder').setRender;
var setRedirect = require('middleware-responder').setRedirect;
var Reminder = require('./models/reminder'); //mongoose.model('Reminder');
var User = require('./models/user');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;

// The Package is past automatically as first parameter
module.exports = function(app, passport) {

app.get('/reminders', setRedirect({auth: '/'}), isAuthenticated, function(req, res, next) {
    var reminderArr = [];
    var pastReminderArr = [];

    Reminder.find({user:ObjectId(req.user._id)}).sort( { 'next_run': 1 } ).exec(function(err, respArr){
                if( respArr == null ){
                    reminderArr = [];
                    pastReminderArr = [];
                }else{
                    for(var i=0; i<respArr.length; i++){
                        var curElem = {};
                        //console.log("respArr[i]._id.valueOf() = " + respArr[i]._id.valueOf());
                        curElem.remId = "" + respArr[i]._id.valueOf();
                        //console.log("curElem.remId = " + curElem.remId);
                        curElem.title = respArr[i].title;
                        //console.log("curElem.title = " + curElem.title);
                        curElem.url = respArr[i].url;
                        curElem.message = respArr[i].message;
                        curElem.email = respArr[i].email;
                        curElem.created = respArr[i].created.toUTCString();
                        if( respArr[i].next_run ) {
                          var nextRunTimeBeforeOffset = respArr[i].next_run.getTime();
                          var offset = parseInt(req.user.timezone) * 60 * 60 * 1000;
                          var nextRunTimeAfterOffset = nextRunTimeBeforeOffset + offset;
                          curElem.next_run = new Date(nextRunTimeAfterOffset).toString();
                          //curElem.next_run = respArr[i].next_run.toUTCString();
                          reminderArr.push(curElem);
                        }else{
                           curElem.next_run = null;
                           pastReminderArr.push(curElem);
                        }
                        //console.log("---------------------------------------");
                    }
                }
                //console.log("---------------------------------------");
                res.render('dashboard/reminders', {user: req.user, reminders: reminderArr, pastReminders:pastReminderArr});
    });
 });

// New Route added for Deleting Reminder
app.get('/deletereminder', function(req, res) {
    console.log("---------------------------------------");
    console.log("req.query.remId = " + req.query.remId);
     Reminder.remove({_id:ObjectId(req.query.remId)}, function(err){
        if(err){
          console.log("Error in deleting Reminder");
        }else{
          console.log("Reminder deleted successfully!");
        }
     });
    console.log("---------------------------------------");

    res.redirect('/reminders');
 });

app.get('/extras', setRedirect({auth: '/'}), isAuthenticated, function(req, res, next) {
  var referralArr = [];
  var affId = "";
  User.findOne({_id:ObjectId(req.user._id)}).exec(function(err, u){
          affId = u.ref_token;
          //console.log("affId = " + affId);
          User.find({affliateReferredBy:affId}).exec(function(err, respArr){
                    if( respArr == null ){
                        referralArr = [];
                    }else{
                        for(var i=0; i<respArr.length; i++){
                            var curElem = {};
                            curElem.name = respArr[i].profile.name;
                            curElem.status = respArr[i].status;
                            //console.log("name   = " + curElem.name);
                            //console.log("status = " + curElem.status);
                            referralArr.push(curElem);
                        }
                    }
          });
    });
  res.render('dashboard/extras', {user: req.user, referrals: referralArr});
});


// Make this a Post route
  app.post('/api/reminder/create', function(req, res, next) {
    //res.send('Anyone can access this');


      var d = new Date();
      var dayS = d.getDate();
      var monthS = d.getMonth();  //[0-11]
      var yearS = d.getFullYear();
      var hourS = d.getHours();
      var minutesS = d.getMinutes();
      var secondsS = d.getSeconds();

      d.setDate(1);
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);

    async.waterfall([
        function(callback){
           Reminder.find({"created" : { $gte : new Date(d)}, "user" : ObjectId(req.user._id) }).count(function (err, count) {
             if (err) {
             } else {
              callback(null, count);
             }
           });
        }
    ], function (err, result) {
       if(err) {
        return 0;
      } else {
                  if( result >= 100 ){
                       res.jsonp({'quotaExceeded' : 'true'});
                  }else{
                          async.waterfall([
                              function(callback){
                                  User.findOne({
                                      api_pubKey: req.user.api_pubKey
                                    })
                                    .exec(function(err, user) {
                                      if (err) {
                                          callback('some error ' + err);
                                      }
                                      if (!user) {
                                          callback('no user');
                                      } else {
                                          //console.log(user.email);
                                          callback(null, user);
                                      }
                                    });
                              },
                              function(user, callback){
                                //console.log(req.body);

                                /* convert to correct timezone */
                                // 2014-08-23 20:02
                                console.log('[PASSED TIME] Save THIS: ' + req.body.time);
                                var passed_in_time = new Date(req.body.time).getTime();
                                //console.log('Converted Time: ' + passed_in_time);
                                //console.log("passed in time:" + passed_in_time + "  |  " + new Date(req.body.time));
                                //console.log("User Time zone", user.timezone);
                                var offset = parseInt(user.timezone) * 60 * 60 * 1000;
                                console.log("offset: " + offset);
                                var nextRunTime = passed_in_time - offset;
                                console.log("nextRunTime: " + new Date(nextRunTime));
                                //console.log("nextRunTime: " + nextRunTime + "  |  " + new Date(nextRunTime));

                                //console.log("req.body.interval : " +  req.body.interval);

                                /* todo add validation */
                                var data = {
                                    title: req.body.title,
                                    url: req.body.url,
                                    email: user.email,
                                    /* email: req.query.email,*/
                                    message: req.body.msg,
                                    next_run: nextRunTime, /* utc time */
                                    user: ObjectId(req.user._id),
                                    interval: req.body.interval
                                };
                                var reminder = new Reminder(data);
                                data.trigger = 'run_cleanup';
                                reminder.save(function (err){
                                  if(err) {
                                    //callback('couldnt save: ' + err);
                                  } else {
                                    //console.log("Reminder Saved Successfully!!!!!");
                                    callback(null, data);
                                  }
                                })
                              }
                          ], function (err, result) {
                             // result now equals 'done'
                             if(err) {
                              res.send(500, 'error: ' + err);
                            } else {
                              res.jsonp(result);
                            }
                          });
                }
            }
    });

  });

  app.get('/reminders/count', function(req, res, next) {
    async.waterfall([
        function(callback){
           Reminder.find({"user" : ObjectId(req.user._id)}).count(function (err, count) {
             if (err) {
             } else {
              callback(null, count);
             }
           });
        }
    ], function (err, result) {
       if(err) {
        res.send(500, 'error: ' + err);
      } else {
        //res.jsonp(result);
        res.json({"NumReminders": result});
      }
    });
  });

};