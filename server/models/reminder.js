'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/* Start new */
var ReminderSchema =  new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String
  },
  message: {
    type: String,
    trim: true
  },
  next_run: {
    type: Date
  },
  interval: {
    type: Number
  },
  cc: [
    {
      type: String
    }
  ],
  email: [
    {
      type: String
    }
  ],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/* end New */
module.exports = mongoose.model('Reminder', ReminderSchema);