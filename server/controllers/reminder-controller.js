'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  //Reminder = mongoose.model('Reminder'),
  Reminder = require('../models/reminder'),
  _ = require('lodash'),
  settings = require('../config/settings'),
  mandrill = require('mandrill-api/mandrill'),
  mandrill_client = new mandrill.Mandrill('yEjL1OQZZEiY44uc0O2fqA');


exports.showList = function(req, res, next, id) {
    // list and render the reminders
  var form = {},
  error = null;
  var reminderArr = ['one', 'two'];
  console.log(req.render);
  res.render(req.render, {user: req.user, reminders: reminderArr});
};
/**
 * Find reminder by id
 */
exports.reminder = function(req, res, next, id) {
  Reminder.load(id, function(err, reminder) {
    if (err) return next(err);
    if (!reminder) return next(new Error('Failed to load reminder ' + id));
    req.reminder = reminder;
    next();
  });
};

/**
 * Create an reminder
 */
exports.create = function(req, res) {
  var reminder = new Reminder(req.body);
  reminder.user = req.user;

  reminder.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the reminder'
      });
    }
    res.json(reminder);

  });
};

/**
 * Update an reminder
 */
exports.update = function(req, res) {
  var reminder = req.reminder;

  reminder = _.extend(reminder, req.body);

  reminder.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the reminder'
      });
    }
    res.json(reminder);

  });
};

/**
 * Delete an reminder
 */
exports.destroy = function(req, res) {
  var reminder = req.reminder;

  reminder.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the reminder'
      });
    }
    res.json(reminder);

  });
};

/**
 * Show an reminder
 */
exports.show = function(req, res) {
  res.json(req.reminder);
};

/**
 * List of Reminders
 */
exports.all = function(req, res) {
  Reminder.find().sort('-created').populate('user', 'name username').exec(function(err, reminders) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the reminders'
      });
    }
    res.json(reminders);

  });
};
/* Added for server 1 min offset */
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}
function subtractMinutes(date, minutes) {
    return new Date(date.getTime() - minutes*60000);
}
exports.checkReminders = function () {
  var date = new Date();


  var current_time = subtractMinutes(date, 1);

  Reminder.find({
      next_run: {
           $lt: current_time
      }
  }, function (err, docs){
      if(err) {
        throw err;
      } else {
        //console.log(docs);
        docs.forEach(function(reminder) {
          exports.sendReminder(reminder);
        });

      }
  });

};

exports.sendReminder = function (reminder){

    var contents = "Hey There!<br><br>You have a reminder!<br>";
    contents+= "<br>" + reminder.title + "<br>" + reminder.url + "<br><br>" + reminder.message + "<br>Send at: " +reminder.next_run;
    var sendTo = reminder.email || 'david@inboundnow.com';
    var subject = "New reminder: " + reminder.title;
    var mailOptions = {
      to: sendTo,
      from: settings.emails.info,
      subject: subject,
      html: contents
    };
    /* Mandril */
    var message = {
        "html": contents,
        "text": contents,
        "subject": subject,
        "from_email": "reminder@thislater.com",
        "from_name": "This, Later.",
        "to": [{
                "email": sendTo[0],
                "name": "David",
                "type": "to"
            }],
        "headers": {
            "Reply-To": "reminder@thislater.com"
        },
        "important": false,
        "track_opens": null,
        "track_clicks": null,
        "auto_text": null,
        "auto_html": null,
        "inline_css": null,
        "url_strip_qs": null,
        "preserve_recipients": null,
        "view_content_link": null
    };
    var async = false;
    var ip_pool = "Main Pool";
    var send_at = reminder.time; // date in past means send now
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
        console.log('mandrill sent');
        console.log(result);

    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);

        /* Fallback, send email via gmail.
        sendMail(mailOptions, function(err, response){
              if(err) {
                  console.log('email error');
                  throw err;
              } else {
                console.log('gmail sent');
              }
        });
         */

        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });

    if (reminder.interval != null) {
      var current_time = new Date().getTime();
      reminder.next_run = new Date(current_time + reminder.interval);
      console.log("next run time", reminder.next_run);
    } else {
      reminder.next_run = null;
    }

    reminder.save(function (err){
      if(err) {
        throw err;
      } else {
        console.log('success mail sent to ' + sendTo);
      }

    })
}