'use strict';

var User = require('../models/user'),
plans = User.getPlans();
var timezones = require('../models/timezones').timezones;

exports.getDefault = function(req, res, next){
  var form = {},
  error = null,
  formFlash = req.flash('form'),
  errorFlash = req.flash('error');

  if (formFlash.length) {
    form.email = formFlash[0].email;
  }
  if (errorFlash.length) {
    error = errorFlash[0];
  }

  res.render(req.render, {user: req.user, form: form, error: error, plans: plans});
};

exports.getBilling = function(req, res, next){
  var form = {},
  error = null,
  formFlash = req.flash('form'),
  errorFlash = req.flash('error');

  if (formFlash.length) {
    form.email = formFlash[0].email;
  }
  if (errorFlash.length) {
    error = errorFlash[0];
  }

  res.render(req.render, {user: req.user, form: form, error: error, plans: plans, title: "Billing Information" });
};

exports.getProfile = function(req, res, next){
  var form = {},
  error = null,
  formFlash = req.flash('form'),
  errorFlash = req.flash('error');

  if (formFlash.length) {
    form.email = formFlash[0].email;
  }
  if (errorFlash.length) {
    error = errorFlash[0];
  }

  res.render(req.render, {user: req.user, form: form, error: error, plans: plans, timezones:timezones});
};