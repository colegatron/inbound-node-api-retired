jQuery(function($) {

  var cardWrapper = $('#cardWrapper'),
  cardForm = $('#cardForm'),
  formError = $('#cardFormError'),
  cardFormBtn = cardForm.find('button');

  if(cardWrapper.length > 0){
    $("input[name=plan]:radio").change(function (e) {
      if(this.value == 'free'){
        cardWrapper.hide();
      } else {
        cardWrapper.show();
      }
    });
    if($("input:radio[name=plan]:checked").val() == 'free'){
      cardWrapper.hide();
    }
  }

  cardForm.submit(function(e) {
    e.preventDefault();

    var cardNum,
    cardMonth,
    cardYear,
    cardCVC;

    if(cardForm.find("input:radio[name=plan]:checked").val() != 'free'){
      cardFormBtn.prop('disabled', true);

      cardNum = $('#card-num').val();
      cardMonth = $('#card-month').val();
      cardYear = $('#card-year').val();
      cardCVC = $('#card-cvc').val();

      Stripe.card.createToken({
        number: cardNum,
        exp_month: cardMonth,
        exp_year: cardYear,
        cvc: cardCVC
      }, function(status, response) {
        if (response.error) {
          formError.find('p').text(response.error.message);
          formError.removeClass('hidden');
          cardForm.find('button').prop('disabled', false);
        } else {
          var token = response.id;
          cardForm.append($('<input type="hidden" name="stripeToken" />').val(token));
          cardForm.get(0).submit();
        }

      });

      return false;
    }
  });

});

/*
 * ANS jQuery Bookmarklet launcher (v.3.0)
 *
 * A navalla suÃ­za (http://idc.anavallasuiza.com/project/bookmarklet/)
 *
 * Released under the Creative Commons Attribution 3.0 Unported License,
 * as defined here: http://creativecommons.org/licenses/by/3.0/
 */

"use strict";

window.bookmarklet = {
  css: {},
  js: {},
  jQuery: false,

  launch: function (file, api) {
    if (!file) {
      return false;
    }
    console.log(api);
    this.loadJS(file, function () {
      var options = window.bookmarklet.options || {};

      window.bookmarklet.options.api_key = api;

      window.bookmarklet.execute(options);
    });
  },
  execute: function (options) {
    if (typeof(options.css) !== 'object') {
      if (options.css) {
        options.css = [options.css];
      } else {
        options.css = [];
      }
    }

    if (typeof(options.js) !== 'object') {
      if (options.js) {
        options.js = [options.js];
      } else {
        options.js = [];
      }
    }

    //Load css
    if (options.css.length) {
      var i;

      for (i in options.css) {
        window.bookmarklet.loadCSS(options.css[i]);
      }
    }

    //Load jQuery
    if (options.jquery) {
      options.js.unshift(options.jquery);
    }

    //Load js
    window.bookmarklet.loadMultipleJS(options.js, function () {
      if (options.jquery) {
        if (!window.bookmarklet.jQuery) {
          window.bookmarklet.jQuery = window.jQuery.noConflict(true);
        }

        window.bookmarklet.jQuery(options.ready);
      } else {
        options.ready();
      }
    });
  },
  loadMultipleJS: function (files, onload) {
    if (files.length === 0) {
      if (onload) {
        onload();
      }

      return true;
    }

    this.loadJS(files.shift(), function () {
      window.bookmarklet.loadMultipleJS(files, onload);
    });
  },
  loadJS: function (file, onload) {
    var element = this.loadedJS(file);

    if (element) {
      if (typeof onload === 'function') {
        onload.call(element);
      }

      return false;
    }

    element = document.createElement('script');
    element.type = 'text/javascript';
    element.src = file;

    if (!document.attachEvent) {
      element.onload = onload;
    } else if (typeof onload === 'function') {
      element.onreadystatechange = function () {
        if (element.readyState === 'complete' || element.readyState === 'loaded') {
          onload.call(element);
          element.onreadystatechange = null;
        }
      };
    }

    document.body.appendChild(element);

    this.js[file] = element;

    return element;
  },
  loadCSS: function (file) {
    if (this.loadedCSS(file)) {
      return false;
    }

    var element = document.createElement('link');
    element.setAttribute('rel', 'stylesheet');
    element.setAttribute('type', 'text/css');
    element.setAttribute('href', file);

    document.getElementsByTagName('head')[0].appendChild(element);

    this.css[file] = element;

    return element;
  },
  loadedJS: function (file) {
    if (this.js[file]) {
      return this.js[file];
    }

    return false;
  },
  loadedCSS: function (file) {
    if (this.css[file]) {
      return this.css[file];
    }

    return false;
  },
  die: function () {
    var i;

    for (i in this.js) {
      this.js[i].parentNode.removeChild(this.js[i]);
    }
    for (i in this.css) {
      this.css[i].parentNode.removeChild(this.css[i]);
    }

    this.js = {};
    this.css = {};
    this.jQuery = false;
  }
};
/* Human Date */

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("matthewmueller-date/index.js", function(exports, require, module){
/**
 * Expose `Date`
 */

module.exports = require('./lib/parser');

});
require.register("matthewmueller-date/lib/date.js", function(exports, require, module){
/**
 * Module Dependencies
 */

var debug = require('debug')('date:date');

/**
 * Time constants
 */

var _second = 1000;
var _minute = 60 * _second;
var _hour = 60 * _minute;
var _day = 24 * _hour;
var _week = 7 * _day;
var _year = 56 * _week;
var _daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Expose `date`
 */

module.exports = date;

/**
 * Initialize `date`
 *
 * @param {Date} offset (optional)
 * @return {Date}
 * @api publics
 */

function date(offset) {
  if(!(this instanceof date)) return new date(offset);
  this._changed = {};
  this.date = new Date(offset);
};

/**
 * Clone the current date
 */

date.prototype.clone = function() {
  return new Date(this.date);
}

/**
 * Has changed
 *
 * @param {String} str
 * @return {Boolean}
 */

date.prototype.changed = function(str) {
  if (this._changed[str] === undefined) return false;
  return this._changed[str];
};

/**
 * add or subtract seconds
 *
 * @param {Number} n
 * @return {date}
 */

date.prototype.second = function(n) {
  var seconds = +n * _second;
  this.update(seconds);
  this._changed['seconds'] = true;
  return this;
}

/**
 * add or subtract minutes
 *
 * @param {Number} n
 * @return {date}
 */

date.prototype.minute = function(n) {
  var minutes = +n * _minute;
  this.update(minutes);
  this._changed['minutes'] = true;
  return this;
}

/**
 * add or subtract hours
 *
 * @param {Number} n
 * @return {date}
 */

date.prototype.hour = function(n) {
  var hours = +n * _hour;
  this.update(hours);
  this._changed['hours'] = true;
  return this;
}

/**
 * add or subtract days
 *
 * @param {Number} n
 * @return {date}
 */

date.prototype.day = function(n) {
  var days = +n * _day;
  this.update(days);
  this._changed['days'] = true;
  return this;
}

/**
 * add or subtract weeks
 *
 * @param {Number} n
 * @return {date}
 */

date.prototype.week = function(n) {
  var weeks = +n * _week;
  this.update(weeks);
  this._changed['weeks'] = true;
  return this;
}

/**
 * add or subtract months
 *
 * @param {Number} n
 * @return {Date}
 */

date.prototype.month = function(n) {
  var d = this.date;
  var day = d.getDate();
  d.setDate(1);
  var month = +n + d.getMonth();
  d.setMonth(month);

  // Handle dates with less days
  var dim = this.daysInMonth(month)
  d.setDate(Math.min(dim, day));
  return this;
};

/**
 * get the days in the month
 */

date.prototype.daysInMonth = function(m) {
  var dim = _daysInMonth[m];
  var leap = leapyear(this.date.getFullYear());
  return (1 == m && leap) ? 29 : 28;
};

/**
 * add or subtract years
 *
 * @param {Number} n
 * @return {date}
 */

date.prototype.year = function(n) {
  var yr = this.date.getFullYear();
  yr += +n;
  this.date.setFullYear(yr);
  this._changed['years'] = true;
  return this;
}

/**
 * Set the time
 *
 * @param {String} h
 * @param {String} m
 * @param {String} s
 * @return {date}
 */

date.prototype.time = function(h, m, s, meridiem) {
  if (h === false) {
    h = this.date.getHours();
  } else {
    h = +h || 0;
    this._changed['hours'] = h;
  }

  if (m === false) {
    m = this.date.getMinutes();
  } else {
    m = +m || 0;
    this._changed['minutes'] = m;
  }

  if (s === false) {
    s = this.date.getSeconds();
  } else {
    s = +s || 0;
    this._changed['seconds'] = s;
  }

  this.date.setHours(h, m, s);
  return this;
};

/**
 * Dynamically create day functions (sunday(n), monday(n), etc.)
 */

var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
days.forEach(function(day, i) {
  date.prototype[days[i]] = function(n) {
    this._changed['days'] = true;
    this.updateDay(i, n);
  };
});

/**
 * go to day of week
 *
 * @param {Number} day
 * @param {Number} n
 * @return {date}
 */

date.prototype.updateDay = function(d, n) {
  n = +(n || 1);
  var diff = (d - this.date.getDay() + 7) % 7;
  if (n > 0) --n;
  diff += (7 * n);
  this.update(diff * _day);
  return this;
}

/**
 * Update the date
 *
 * @param {Number} ms
 * @return {Date}
 * @api private
 */

date.prototype.update = function(ms) {
  this.date = new Date(this.date.getTime() + ms);
  return this;
};

/**
 * leap year
 *
 * @param {Number} yr
 * @return {Boolean}
 */

function leapyear(yr) {
  return (yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0;
}

});
require.register("matthewmueller-date/lib/parser.js", function(exports, require, module){
/**
 * Module Dependencies
 */

var date = require('./date');
var debug = require('debug')('date:parser');

/**
 * Days
 */

var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
              'october', 'november', 'december' ]

/**
 * Regexs
 */

// 5, 05, 5:30, 5.30, 05:30:10, 05:30.10, 05.30.10, at 5
var rMeridiem = /^(\d{1,2})([:.](\d{1,2}))?([:.](\d{1,2}))?\s*([ap]m)/;
var rHourMinute = /^(\d{1,2})([:.](\d{1,2}))([:.](\d{1,2}))?/;
var rAtHour = /^at\s?(\d{1,2})$/;
var rDays = /\b(sun(day)?|mon(day)?|tues(day)?|wed(nesday)?|thur(sday|s)?|fri(day)?|sat(urday)?)s?\b/;
var rMonths = /^((\d{1,2})(st|nd|rd|th))\sof\s(january|february|march|april|may|june|july|august|september|october|november|december)/;
var rPast = /\b(last|yesterday|ago)\b/;
var rDayMod = /\b(morning|noon|afternoon|night|evening|midnight)\b/;
var rAgo = /^(\d*)\s?\b(second|minute|hour|day|week|month|year)[s]?\b\s?ago$/;

/**
 * Expose `parser`
 */

module.exports = parser;

/**
 * Initialize `parser`
 *
 * @param {String} str
 * @return {Date}
 * @api publics
 */

function parser(str, offset) {
  if(!(this instanceof parser)) return new parser(str, offset);
  if(typeof offset == 'string') offset = parser(offset);
  var d = offset || new Date;
  this.date = new date(d);
  this.original = str;
  this.str = str.toLowerCase();
  this.stash = [];
  this.tokens = [];
  while (this.advance() !== 'eos');
  debug('tokens %j', this.tokens)
  this.nextTime(d);
  if (this.date.date == d) throw new Error('Invalid date');
  return this.date.date;
};

/**
 * Advance a token
 */

parser.prototype.advance = function() {
  var tok = this.eos()
    || this.space()
    || this._next()
    || this.last()
    || this.dayByName()
    || this.monthByName()
    || this.timeAgo()
    || this.ago()
    || this.yesterday()
    || this.tomorrow()
    || this.noon()
    || this.midnight()
    || this.night()
    || this.evening()
    || this.afternoon()
    || this.morning()
    || this.tonight()
    || this.meridiem()
    || this.hourminute()
    || this.athour()
    || this.week()
    || this.month()
    || this.year()
    || this.second()
    || this.minute()
    || this.hour()
    || this.day()
    || this.number()
    || this.string()
    || this.other();

  this.tokens.push(tok);
  return tok;
};

/**
 * Lookahead `n` tokens.
 *
 * @param {Number} n
 * @return {Object}
 * @api private
 */

parser.prototype.lookahead = function(n){
  var fetch = n - this.stash.length;
  if (fetch == 0) return this.lookahead(++n);
  while (fetch-- > 0) this.stash.push(this.advance());
  return this.stash[--n];
};

/**
 * Lookahead a single token.
 *
 * @return {Token}
 * @api private
 */

parser.prototype.peek = function() {
  return this.lookahead(1);
};

/**
 * Fetch next token including those stashed by peek.
 *
 * @return {Token}
 * @api private
 */

parser.prototype.next = function() {
  var tok = this.stashed() || this.advance();
  return tok;
};

/**
 * Return the next possibly stashed token.
 *
 * @return {Token}
 * @api private
 */

parser.prototype.stashed = function() {
  var stashed = this.stash.shift();
  return stashed;
};

/**
 * Consume the given `len`.
 *
 * @param {Number|Array} len
 * @api private
 */

parser.prototype.skip = function(len){
  this.str = this.str.substr(Array.isArray(len)
    ? len[0].length
    : len);
};

/**
 * EOS
 */

parser.prototype.eos = function() {
  if (this.str.length) return;
  return 'eos';
};

/**
 * Space
 */

parser.prototype.space = function() {
  var captures;
  if (captures = /^([ \t]+)/.exec(this.str)) {
    this.skip(captures);
    return this.advance();
  }
};

/**
 * Second
 */

parser.prototype.second = function() {
  var captures;
  if (captures = /^s(ec|econd)?s?/.exec(this.str)) {
    this.skip(captures);
    return 'second';
  }
};

/**
 * Minute
 */

parser.prototype.minute = function() {
  var captures;
  if (captures = /^m(in|inute)?s?/.exec(this.str)) {
    this.skip(captures);
    return 'minute';
  }
};

/**
 * Hour
 */

parser.prototype.hour = function() {
  var captures;
  if (captures = /^h(r|our)s?/.exec(this.str)) {
    this.skip(captures);
    return 'hour';
  }
};

/**
 * Day
 */

parser.prototype.day = function() {
  var captures;
  if (captures = /^d(ay)?s?/.exec(this.str)) {
    this.skip(captures);
    return 'day';
  }
};

/**
 * Day by name
 */

parser.prototype.dayByName = function() {
  var captures;
  var r = new RegExp('^' + rDays.source);
  if (captures = r.exec(this.str)) {
    var day = captures[1];
    this.skip(captures);
    this.date[day](1);
    return captures[1];
  }
};


/**
 * Month by name
 */

parser.prototype.monthByName = function() {
  var captures;
  if (captures = rMonths.exec(this.str)) {
    var day = captures[2]
    var month = captures[4];
    this.date.date.setMonth((months.indexOf(month)));
    if (day) this.date.date.setDate(parseInt(day) - 1);
    this.skip(captures);
    return captures[0];
  }
};


parser.prototype.timeAgo = function() {
  var captures;
  if (captures = rAgo.exec(this.str)) {
    var num = captures[1];
    var mod = captures[2];
    this.date[mod](-num);
    this.skip(captures);
    return 'timeAgo';
  }
};

/**
 * Week
 */

parser.prototype.week = function() {
  var captures;
  if (captures = /^w(k|eek)s?/.exec(this.str)) {
    this.skip(captures);
    return 'week';
  }
};

/**
 * Month
 */

parser.prototype.month = function() {
  var captures;
  if (captures = /^mon(th)?(es|s)?\b/.exec(this.str)) {
    this.skip(captures);
    return 'month';
  }

};

/**
 * Week
 */

parser.prototype.year = function() {
  var captures;
  if (captures = /^y(r|ear)s?/.exec(this.str)) {
    this.skip(captures);
    return 'year';
  }
};

/**
 * Meridiem am/pm
 */

parser.prototype.meridiem = function() {
  var captures;
  if (captures = rMeridiem.exec(this.str)) {
    this.skip(captures);
    this.time(captures[1], captures[3], captures[5], captures[6]);
    return 'meridiem';
  }
};

/**
 * Hour Minute (ex. 12:30)
 */

parser.prototype.hourminute = function() {
  var captures;
  if (captures = rHourMinute.exec(this.str)) {
    this.skip(captures);
    this.time(captures[1], captures[3], captures[5]);
    return 'hourminute';
  }
};

/**
 * At Hour (ex. at 5)
 */

parser.prototype.athour = function() {
  var captures;
  if (captures = rAtHour.exec(this.str)) {
    this.skip(captures);
    this.time(captures[1], 0, 0, this._meridiem);
    this._meridiem = null;
    return 'athour';
  }
};

/**
 * Time set helper
 */

parser.prototype.time = function(h, m, s, meridiem) {
  var d = this.date;
  var before = d.clone();

  if (meridiem) {
    // convert to 24 hour
    h = ('pm' == meridiem && 12 > h) ? +h + 12 : h; // 6pm => 18
    h = ('am' == meridiem && 12 == h) ? 0 : h; // 12am => 0
  }

  m = (!m && d.changed('minutes')) ? false : m;
  s = (!s && d.changed('seconds')) ? false : s;
  d.time(h, m, s);
};

/**
 * Best attempt to pick the next time this date will occur
 *
 * TODO: place at the end of the parsing
 */

parser.prototype.nextTime = function(before) {
  var d = this.date;
  var orig = this.original;

  if (before <= d.date || rPast.test(orig)) return this;

  // If time is in the past, we need to guess at the next time
  if (rDays.test(orig)) d.day(7);
  else if ((before - d.date) / 1000 > 60) d.day(1);

  return this;
};

/**
 * Yesterday
 */

parser.prototype.yesterday = function() {
  var captures;
  if (captures = /^(yes(terday)?)/.exec(this.str)) {
    this.skip(captures);
    this.date.day(-1);
    return 'yesterday';
  }
};

/**
 * Tomorrow
 */

parser.prototype.tomorrow = function() {
  var captures;
  if (captures = /^tom(orrow)?/.exec(this.str)) {
    this.skip(captures);
    this.date.day(1);
    return 'tomorrow';
  }
};

/**
 * Noon
 */

parser.prototype.noon = function() {
  var captures;
  if (captures = /^noon\b/.exec(this.str)) {
    this.skip(captures);
    var before = this.date.clone();
    this.date.date.setHours(12, 0, 0);
    return 'noon';
  }
};

/**
 * Midnight
 */

parser.prototype.midnight = function() {
  var captures;
  if (captures = /^midnight\b/.exec(this.str)) {
    this.skip(captures);
    var before = this.date.clone();
    this.date.date.setHours(0, 0, 0);
    return 'midnight';
  }
};

/**
 * Night (arbitrarily set at 7pm)
 */

parser.prototype.night = function() {
  var captures;
  if (captures = /^night\b/.exec(this.str)) {
    this.skip(captures);
    this._meridiem = 'pm';
    var before = this.date.clone();
    this.date.date.setHours(19, 0, 0);
    return 'night'
  }
};

/**
 * Evening (arbitrarily set at 5pm)
 */

parser.prototype.evening = function() {
  var captures;
  if (captures = /^evening\b/.exec(this.str)) {
    this.skip(captures);
    this._meridiem = 'pm';
    var before = this.date.clone();
    this.date.date.setHours(17, 0, 0);
    return 'evening'
  }
};

/**
 * Afternoon (arbitrarily set at 2pm)
 */

parser.prototype.afternoon = function() {
  var captures;
  if (captures = /^afternoon\b/.exec(this.str)) {
    this.skip(captures);
    this._meridiem = 'pm';
    var before = this.date.clone();

    if (this.date.changed('hours')) return 'afternoon';

    this.date.date.setHours(14, 0, 0);
    return 'afternoon';
  }
};


/**
 * Morning (arbitrarily set at 8am)
 */

parser.prototype.morning = function() {
  var captures;
  if (captures = /^morning\b/.exec(this.str)) {
    this.skip(captures);
    this._meridiem = 'am';
    var before = this.date.clone();
    if (!this.date.changed('hours')) this.date.date.setHours(8, 0, 0);
    return 'morning';
  }
};

/**
 * Tonight
 */

parser.prototype.tonight = function() {
  var captures;
  if (captures = /^tonight\b/.exec(this.str)) {
    this.skip(captures);
    this._meridiem = 'pm';
    return 'tonight';
  }
};

/**
 * Next time
 */

parser.prototype._next = function() {
  var captures;
  if (captures = /^next/.exec(this.str)) {
    this.skip(captures);
    var d = new Date(this.date.date);
    var mod = this.peek();

    // If we have a defined modifier, then update
    if (this.date[mod]) {
      this.next();
      // slight hack to modify already modified
      this.date = date(d);
      this.date[mod](1);
    } else if (rDayMod.test(mod)) {
      this.date.day(1);
    }

    return 'next';
  }
};

/**
 * Last time
 */

parser.prototype.last = function() {
  var captures;
  if (captures = /^last/.exec(this.str)) {
    this.skip(captures);
    var d = new Date(this.date.date);
    var mod = this.peek();

    // If we have a defined modifier, then update
    if (this.date[mod]) {
      this.next();
      // slight hack to modify already modified
      this.date = date(d);
      this.date[mod](-1);
    } else if (rDayMod.test(mod)) {
      this.date.day(-1);
    }

    return 'last';
  }
};

/**
 * Ago
 */

parser.prototype.ago = function() {
  var captures;
  if (captures = /^ago\b/.exec(this.str)) {
    this.skip(captures);
    return 'ago';
  }
};

/**
 * Number
 */

parser.prototype.number = function() {
  var captures;
  if (captures = /^(\d+)/.exec(this.str)) {
    var n = captures[1];
    this.skip(captures);
    var mod = this.peek();

    // If we have a defined modifier, then update
    if (this.date[mod]) {
      if ('ago' == this.peek()) n = -n;
      this.date[mod](n);
    } else if (this._meridiem) {
      // when we don't have meridiem, possibly use context to guess
      this.time(n, 0, 0, this._meridiem);
      this._meridiem = null;
    } else if (this.original.indexOf('at') > -1 ) {
      this.time(n, 0, 0, this._meridiem);
      this._meridiem = null;
    }

    return 'number';
  }
};

/**
 * String
 */

parser.prototype.string = function() {
  var captures;
  if (captures = /^\w+/.exec(this.str)) {
    this.skip(captures);
    return 'string';
  }
};

/**
 * Other
 */

parser.prototype.other = function() {
  var captures;
  if (captures = /^./.exec(this.str)) {
    this.skip(captures);
    return 'other';
  }
};

});
require.register("component-domify/index.js", function(exports, require, module){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return document.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = document.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

});
require.register("matthewmueller-clock/index.js", function(exports, require, module){
/**
 * Module Dependencies
 */

var domify = require('domify');
var el = domify(require('./template'));

/**
 * Expose `Clock`
 */

module.exports = Clock;

/**
 * Clock
 *
 * @param {Number} hr
 * @param {Number} min
 * @param {Number} sec
 * @return {Clock}
 * @api public
 */

function Clock(hr, min, sec) {
  if (!(this instanceof Clock)) return new Clock(hr, min, sec)
  this.hr = hr || 12;
  this.min = min || 0;
  this.sec = sec || 0;
  this.el = el.cloneNode(true);
  this.hrHand = this.el.querySelector('.hr');
  this.minHand = this.el.querySelector('.min');
  this.secHand = this.el.querySelector('.sec');

  // refresh
  this.hour(this.hr);
  this.minute(this.min);
  this.second(this.sec);
}

/**
 * Refresh the clock to the current time
 *
 * @return {Clock}
 * @api public
 */

Clock.prototype.refresh = function() {
  var date = new Date;
  this.hour(date.getHours());
  this.minute(date.getMinutes());
  this.second(date.getSeconds());
  return this;
};

/**
 * Get or set the hour
 *
 * @param {Number} hr
 * @return {Number|Clock}
 * @api public
 */

Clock.prototype.hour = function(hr) {
  if (hr === undefined) return this.hr;
  this.hr = hr;
  var deg = (60 * hr + this.min) / 2;
  this.hrHand.setAttribute('transform', 'rotate(' + deg + ')');
  return this;
};

/**
 * Get or set the minute
 *
 * @param {Number} min
 * @return {Number|Clock}
 * @api public
 */

Clock.prototype.minute = function(min) {
  if (min === undefined) return this.min;
  this.min = min;
  var deg = 6 * min;
  this.minHand.setAttribute('transform', 'rotate(' + deg + ')');
  return this;
};

/**
 * Get or set the second
 *
 * @param {Number} sec
 * @return {Number|Clock}
 * @api public
 */

Clock.prototype.second = function(sec) {
  if (sec === undefined) return this.sec;
  this.sec = sec;
  var deg = 6 * sec;
  this.secHand.setAttribute('transform', 'rotate(' + deg + ')');
  return this;
};

});
require.register("matthewmueller-clock/template.js", function(exports, require, module){
module.exports = '<svg xmlns="http://www.w3.org/2000/svg"\n     xmlns:xlink="http://www.w3.org/1999/xlink"\n     viewBox="-1024 -1024 2048 2048" width="100%" height="100%">\n  <title>Swiss Railway Clock</title>\n  <style type="text/css">\n    .bg {stroke: none; fill: none;}\n    .fc {stroke: none; fill: black;}\n    .h1 {stroke: none; fill: black;}\n    .h2 {stroke: none; fill: #aa0000;}\n  </style>\n  <defs>\n    <path id="mark1" d="M -20,-1000 l 40,0 0,100 -40,0 z" />\n    <path id="mark2" d="M -40,-1000 l 80,0 0,240 -80,0 z" />\n    <path id="mark3" d="M -40,-1000 l 80,0 0,300 -80,0 z" />\n    <path id="handh" d="M -50,-600  l 50,-50 50,50 0,800  -100,0 z" />\n    <path id="handm" d="M -40,-900  l 40,-40 40,40 0,1180 -80,0  z" />\n    <g    id="hands">\n      <path d="M -10,-910 l  10,-10 10,10 2,300 -24,0 z\n               M -13,-390 l  26,0         7,690 -40,0 z" />\n      <path d="M   0,-620 a 120,120 0 0 1 0,240\n                          a 120,120 0 0 1 0,-240 z\n               M   0,-560 a  60,60  0 0 0 0,120\n                          a  60,60  0 0 0 0,-120 z" />\n    </g>\n    <g id="face1">\n      <use xlink:href="#mark1" transform="rotate(06)" />\n      <use xlink:href="#mark1" transform="rotate(12)" />\n      <use xlink:href="#mark1" transform="rotate(18)" />\n      <use xlink:href="#mark1" transform="rotate(24)" />\n    </g>\n    <g id="face2">\n      <use xlink:href="#face1" />\n      <use xlink:href="#face1" transform="rotate(30)" />\n      <use xlink:href="#face1" transform="rotate(60)" />\n      <use xlink:href="#mark3" />\n      <use xlink:href="#mark2" transform="rotate(30)" />\n      <use xlink:href="#mark2" transform="rotate(60)" />\n    </g>\n    <g id="face">\n      <use xlink:href="#face2" />\n      <use xlink:href="#face2" transform="rotate(90)"  />\n      <use xlink:href="#face2" transform="rotate(180)" />\n      <use xlink:href="#face2" transform="rotate(270)" />\n    </g>\n  </defs>\n  <circle class="bg" r="1024" />\n  <use xlink:href="#face"  class="fc" />\n  <use xlink:href="#handh" class="h1 hr" transform="rotate(0)" />\n  <use xlink:href="#handm" class="h1 min" transform="rotate(0)" />\n  <use xlink:href="#hands" class="h2 sec" transform="rotate(0)" />\n  <!-- hands at 10:09:02 -->\n</svg>\n';
});
require.register("component-range/index.js", function(exports, require, module){

module.exports = function(from, to, inclusive){
  var ret = [];
  if (inclusive) to++;

  for (var n = from; n < to; ++n) {
    ret.push(n);
  }

  return ret;
}
});
require.register("component-jquery/index.js", function(exports, require, module){
/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
  // The deferred used on DOM ready
  readyList,

  // A central reference to the root jQuery(document)
  rootjQuery,

  // Support: IE<9
  // For `typeof node.method` instead of `node.method !== undefined`
  core_strundefined = typeof undefined,

  // Use the correct document accordingly with window argument (sandbox)
  document = window.document,
  location = window.location,

  // Map over jQuery in case of overwrite
  _jQuery = window.jQuery,

  // Map over the $ in case of overwrite
  _$ = window.$,

  // [[Class]] -> type pairs
  class2type = {},

  // List of deleted data cache ids, so we can reuse them
  core_deletedIds = [],

  core_version = "1.9.1",

  // Save a reference to some core methods
  core_concat = core_deletedIds.concat,
  core_push = core_deletedIds.push,
  core_slice = core_deletedIds.slice,
  core_indexOf = core_deletedIds.indexOf,
  core_toString = class2type.toString,
  core_hasOwn = class2type.hasOwnProperty,
  core_trim = core_version.trim,

  // Define a local copy of jQuery
  jQuery = function( selector, context ) {
    // The jQuery object is actually just the init constructor 'enhanced'
    return new jQuery.fn.init( selector, context, rootjQuery );
  },

  // Used for matching numbers
  core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

  // Used for splitting on whitespace
  core_rnotwhite = /\S+/g,

  // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
  rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

  // A simple way to check for HTML strings
  // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
  // Strict HTML recognition (#11290: must start with <)
  rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

  // Match a standalone tag
  rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

  // JSON RegExp
  rvalidchars = /^[\],:{}\s]*$/,
  rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
  rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
  rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

  // Matches dashed string for camelizing
  rmsPrefix = /^-ms-/,
  rdashAlpha = /-([\da-z])/gi,

  // Used by jQuery.camelCase as callback to replace()
  fcamelCase = function( all, letter ) {
    return letter.toUpperCase();
  },

  // The ready event handler
  completed = function( event ) {

    // readyState === "complete" is good enough for us to call the dom ready in oldIE
    if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
      detach();
      jQuery.ready();
    }
  },
  // Clean-up method for dom ready events
  detach = function() {
    if ( document.addEventListener ) {
      document.removeEventListener( "DOMContentLoaded", completed, false );
      window.removeEventListener( "load", completed, false );

    } else {
      document.detachEvent( "onreadystatechange", completed );
      window.detachEvent( "onload", completed );
    }
  };

jQuery.fn = jQuery.prototype = {
  // The current version of jQuery being used
  jquery: core_version,

  constructor: jQuery,
  init: function( selector, context, rootjQuery ) {
    var match, elem;

    // HANDLE: $(""), $(null), $(undefined), $(false)
    if ( !selector ) {
      return this;
    }

    // Handle HTML strings
    if ( typeof selector === "string" ) {
      if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
        // Assume that strings that start and end with <> are HTML and skip the regex check
        match = [ null, selector, null ];

      } else {
        match = rquickExpr.exec( selector );
      }

      // Match html or make sure no context is specified for #id
      if ( match && (match[1] || !context) ) {

        // HANDLE: $(html) -> $(array)
        if ( match[1] ) {
          context = context instanceof jQuery ? context[0] : context;

          // scripts is true for back-compat
          jQuery.merge( this, jQuery.parseHTML(
            match[1],
            context && context.nodeType ? context.ownerDocument || context : document,
            true
          ) );

          // HANDLE: $(html, props)
          if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
            for ( match in context ) {
              // Properties of context are called as methods if possible
              if ( jQuery.isFunction( this[ match ] ) ) {
                this[ match ]( context[ match ] );

              // ...and otherwise set as attributes
              } else {
                this.attr( match, context[ match ] );
              }
            }
          }

          return this;

        // HANDLE: $(#id)
        } else {
          elem = document.getElementById( match[2] );

          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE and Opera return items
            // by name instead of ID
            if ( elem.id !== match[2] ) {
              return rootjQuery.find( selector );
            }

            // Otherwise, we inject the element directly into the jQuery object
            this.length = 1;
            this[0] = elem;
          }

          this.context = document;
          this.selector = selector;
          return this;
        }

      // HANDLE: $(expr, $(...))
      } else if ( !context || context.jquery ) {
        return ( context || rootjQuery ).find( selector );

      // HANDLE: $(expr, context)
      // (which is just equivalent to: $(context).find(expr)
      } else {
        return this.constructor( context ).find( selector );
      }

    // HANDLE: $(DOMElement)
    } else if ( selector.nodeType ) {
      this.context = this[0] = selector;
      this.length = 1;
      return this;

    // HANDLE: $(function)
    // Shortcut for document ready
    } else if ( jQuery.isFunction( selector ) ) {
      return rootjQuery.ready( selector );
    }

    if ( selector.selector !== undefined ) {
      this.selector = selector.selector;
      this.context = selector.context;
    }

    return jQuery.makeArray( selector, this );
  },

  // Start with an empty selector
  selector: "",

  // The default length of a jQuery object is 0
  length: 0,

  // The number of elements contained in the matched element set
  size: function() {
    return this.length;
  },

  toArray: function() {
    return core_slice.call( this );
  },

  // Get the Nth element in the matched element set OR
  // Get the whole matched element set as a clean array
  get: function( num ) {
    return num == null ?

      // Return a 'clean' array
      this.toArray() :

      // Return just the object
      ( num < 0 ? this[ this.length + num ] : this[ num ] );
  },

  // Take an array of elements and push it onto the stack
  // (returning the new matched element set)
  pushStack: function( elems ) {

    // Build a new jQuery matched element set
    var ret = jQuery.merge( this.constructor(), elems );

    // Add the old object onto the stack (as a reference)
    ret.prevObject = this;
    ret.context = this.context;

    // Return the newly-formed element set
    return ret;
  },

  // Execute a callback for every element in the matched set.
  // (You can seed the arguments with an array of args, but this is
  // only used internally.)
  each: function( callback, args ) {
    return jQuery.each( this, callback, args );
  },

  ready: function( fn ) {
    // Add the callback
    jQuery.ready.promise().done( fn );

    return this;
  },

  slice: function() {
    return this.pushStack( core_slice.apply( this, arguments ) );
  },

  first: function() {
    return this.eq( 0 );
  },

  last: function() {
    return this.eq( -1 );
  },

  eq: function( i ) {
    var len = this.length,
      j = +i + ( i < 0 ? len : 0 );
    return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
  },

  map: function( callback ) {
    return this.pushStack( jQuery.map(this, function( elem, i ) {
      return callback.call( elem, i, elem );
    }));
  },

  end: function() {
    return this.prevObject || this.constructor(null);
  },

  // For internal use only.
  // Behaves like an Array's method, not like a jQuery method.
  push: core_push,
  sort: [].sort,
  splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
  var src, copyIsArray, copy, name, options, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : [];

          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = jQuery.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

jQuery.extend({
  noConflict: function( deep ) {
    if ( window.$ === jQuery ) {
      window.$ = _$;
    }

    if ( deep && window.jQuery === jQuery ) {
      window.jQuery = _jQuery;
    }

    return jQuery;
  },

  // Is the DOM ready to be used? Set to true once it occurs.
  isReady: false,

  // A counter to track how many items to wait for before
  // the ready event fires. See #6781
  readyWait: 1,

  // Hold (or release) the ready event
  holdReady: function( hold ) {
    if ( hold ) {
      jQuery.readyWait++;
    } else {
      jQuery.ready( true );
    }
  },

  // Handle when the DOM is ready
  ready: function( wait ) {

    // Abort if there are pending holds or we're already ready
    if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
      return;
    }

    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
    if ( !document.body ) {
      return setTimeout( jQuery.ready );
    }

    // Remember that the DOM is ready
    jQuery.isReady = true;

    // If a normal DOM Ready event fired, decrement, and wait if need be
    if ( wait !== true && --jQuery.readyWait > 0 ) {
      return;
    }

    // If there are functions bound, to execute
    readyList.resolveWith( document, [ jQuery ] );

    // Trigger any bound ready events
    if ( jQuery.fn.trigger ) {
      jQuery( document ).trigger("ready").off("ready");
    }
  },

  // See test/unit/core.js for details concerning isFunction.
  // Since version 1.3, DOM methods and functions like alert
  // aren't supported. They return false on IE (#2968).
  isFunction: function( obj ) {
    return jQuery.type(obj) === "function";
  },

  isArray: Array.isArray || function( obj ) {
    return jQuery.type(obj) === "array";
  },

  isWindow: function( obj ) {
    return obj != null && obj == obj.window;
  },

  isNumeric: function( obj ) {
    return !isNaN( parseFloat(obj) ) && isFinite( obj );
  },

  type: function( obj ) {
    if ( obj == null ) {
      return String( obj );
    }
    return typeof obj === "object" || typeof obj === "function" ?
      class2type[ core_toString.call(obj) ] || "object" :
      typeof obj;
  },

  isPlainObject: function( obj ) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
      return false;
    }

    try {
      // Not own constructor property must be Object
      if ( obj.constructor &&
        !core_hasOwn.call(obj, "constructor") &&
        !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
      }
    } catch ( e ) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for ( key in obj ) {}

    return key === undefined || core_hasOwn.call( obj, key );
  },

  isEmptyObject: function( obj ) {
    var name;
    for ( name in obj ) {
      return false;
    }
    return true;
  },

  error: function( msg ) {
    throw new Error( msg );
  },

  // data: string of html
  // context (optional): If specified, the fragment will be created in this context, defaults to document
  // keepScripts (optional): If true, will include scripts passed in the html string
  parseHTML: function( data, context, keepScripts ) {
    if ( !data || typeof data !== "string" ) {
      return null;
    }
    if ( typeof context === "boolean" ) {
      keepScripts = context;
      context = false;
    }
    context = context || document;

    var parsed = rsingleTag.exec( data ),
      scripts = !keepScripts && [];

    // Single tag
    if ( parsed ) {
      return [ context.createElement( parsed[1] ) ];
    }

    parsed = jQuery.buildFragment( [ data ], context, scripts );
    if ( scripts ) {
      jQuery( scripts ).remove();
    }
    return jQuery.merge( [], parsed.childNodes );
  },

  parseJSON: function( data ) {
    // Attempt to parse using the native JSON parser first
    if ( window.JSON && window.JSON.parse ) {
      return window.JSON.parse( data );
    }

    if ( data === null ) {
      return data;
    }

    if ( typeof data === "string" ) {

      // Make sure leading/trailing whitespace is removed (IE can't handle it)
      data = jQuery.trim( data );

      if ( data ) {
        // Make sure the incoming data is actual JSON
        // Logic borrowed from http://json.org/json2.js
        if ( rvalidchars.test( data.replace( rvalidescape, "@" )
          .replace( rvalidtokens, "]" )
          .replace( rvalidbraces, "")) ) {

          return ( new Function( "return " + data ) )();
        }
      }
    }

    jQuery.error( "Invalid JSON: " + data );
  },

  // Cross-browser xml parsing
  parseXML: function( data ) {
    var xml, tmp;
    if ( !data || typeof data !== "string" ) {
      return null;
    }
    try {
      if ( window.DOMParser ) { // Standard
        tmp = new DOMParser();
        xml = tmp.parseFromString( data , "text/xml" );
      } else { // IE
        xml = new ActiveXObject( "Microsoft.XMLDOM" );
        xml.async = "false";
        xml.loadXML( data );
      }
    } catch( e ) {
      xml = undefined;
    }
    if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
      jQuery.error( "Invalid XML: " + data );
    }
    return xml;
  },

  noop: function() {},

  // Evaluates a script in a global context
  // Workarounds based on findings by Jim Driscoll
  // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
  globalEval: function( data ) {
    if ( data && jQuery.trim( data ) ) {
      // We use execScript on Internet Explorer
      // We use an anonymous function so that context is window
      // rather than jQuery in Firefox
      ( window.execScript || function( data ) {
        window[ "eval" ].call( window, data );
      } )( data );
    }
  },

  // Convert dashed to camelCase; used by the css and data modules
  // Microsoft forgot to hump their vendor prefix (#9572)
  camelCase: function( string ) {
    return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
  },

  nodeName: function( elem, name ) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
  },

  // args is for internal usage only
  each: function( obj, callback, args ) {
    var value,
      i = 0,
      length = obj.length,
      isArray = isArraylike( obj );

    if ( args ) {
      if ( isArray ) {
        for ( ; i < length; i++ ) {
          value = callback.apply( obj[ i ], args );

          if ( value === false ) {
            break;
          }
        }
      } else {
        for ( i in obj ) {
          value = callback.apply( obj[ i ], args );

          if ( value === false ) {
            break;
          }
        }
      }

    // A special, fast, case for the most common use of each
    } else {
      if ( isArray ) {
        for ( ; i < length; i++ ) {
          value = callback.call( obj[ i ], i, obj[ i ] );

          if ( value === false ) {
            break;
          }
        }
      } else {
        for ( i in obj ) {
          value = callback.call( obj[ i ], i, obj[ i ] );

          if ( value === false ) {
            break;
          }
        }
      }
    }

    return obj;
  },

  // Use native String.trim function wherever possible
  trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
    function( text ) {
      return text == null ?
        "" :
        core_trim.call( text );
    } :

    // Otherwise use our own trimming functionality
    function( text ) {
      return text == null ?
        "" :
        ( text + "" ).replace( rtrim, "" );
    },

  // results is for internal usage only
  makeArray: function( arr, results ) {
    var ret = results || [];

    if ( arr != null ) {
      if ( isArraylike( Object(arr) ) ) {
        jQuery.merge( ret,
          typeof arr === "string" ?
          [ arr ] : arr
        );
      } else {
        core_push.call( ret, arr );
      }
    }

    return ret;
  },

  inArray: function( elem, arr, i ) {
    var len;

    if ( arr ) {
      if ( core_indexOf ) {
        return core_indexOf.call( arr, elem, i );
      }

      len = arr.length;
      i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

      for ( ; i < len; i++ ) {
        // Skip accessing in sparse arrays
        if ( i in arr && arr[ i ] === elem ) {
          return i;
        }
      }
    }

    return -1;
  },

  merge: function( first, second ) {
    var l = second.length,
      i = first.length,
      j = 0;

    if ( typeof l === "number" ) {
      for ( ; j < l; j++ ) {
        first[ i++ ] = second[ j ];
      }
    } else {
      while ( second[j] !== undefined ) {
        first[ i++ ] = second[ j++ ];
      }
    }

    first.length = i;

    return first;
  },

  grep: function( elems, callback, inv ) {
    var retVal,
      ret = [],
      i = 0,
      length = elems.length;
    inv = !!inv;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( ; i < length; i++ ) {
      retVal = !!callback( elems[ i ], i );
      if ( inv !== retVal ) {
        ret.push( elems[ i ] );
      }
    }

    return ret;
  },

  // arg is for internal usage only
  map: function( elems, callback, arg ) {
    var value,
      i = 0,
      length = elems.length,
      isArray = isArraylike( elems ),
      ret = [];

    // Go through the array, translating each of the items to their
    if ( isArray ) {
      for ( ; i < length; i++ ) {
        value = callback( elems[ i ], i, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }

    // Go through every key on the object,
    } else {
      for ( i in elems ) {
        value = callback( elems[ i ], i, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }
    }

    // Flatten any nested arrays
    return core_concat.apply( [], ret );
  },

  // A global GUID counter for objects
  guid: 1,

  // Bind a function to a context, optionally partially applying any
  // arguments.
  proxy: function( fn, context ) {
    var args, proxy, tmp;

    if ( typeof context === "string" ) {
      tmp = fn[ context ];
      context = fn;
      fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if ( !jQuery.isFunction( fn ) ) {
      return undefined;
    }

    // Simulated bind
    args = core_slice.call( arguments, 2 );
    proxy = function() {
      return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
    };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    return proxy;
  },

  // Multifunctional method to get and set values of a collection
  // The value/s can optionally be executed if it's a function
  access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
    var i = 0,
      length = elems.length,
      bulk = key == null;

    // Sets many values
    if ( jQuery.type( key ) === "object" ) {
      chainable = true;
      for ( i in key ) {
        jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
      }

    // Sets one value
    } else if ( value !== undefined ) {
      chainable = true;

      if ( !jQuery.isFunction( value ) ) {
        raw = true;
      }

      if ( bulk ) {
        // Bulk operations run against the entire set
        if ( raw ) {
          fn.call( elems, value );
          fn = null;

        // ...except when executing function values
        } else {
          bulk = fn;
          fn = function( elem, key, value ) {
            return bulk.call( jQuery( elem ), value );
          };
        }
      }

      if ( fn ) {
        for ( ; i < length; i++ ) {
          fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
        }
      }
    }

    return chainable ?
      elems :

      // Gets
      bulk ?
        fn.call( elems ) :
        length ? fn( elems[0], key ) : emptyGet;
  },

  now: function() {
    return ( new Date() ).getTime();
  }
});

jQuery.ready.promise = function( obj ) {
  if ( !readyList ) {

    readyList = jQuery.Deferred();

    // Catch cases where $(document).ready() is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if ( document.readyState === "complete" ) {
      // Handle it asynchronously to allow scripts the opportunity to delay ready
      setTimeout( jQuery.ready );

    // Standards-based browsers support DOMContentLoaded
    } else if ( document.addEventListener ) {
      // Use the handy event callback
      document.addEventListener( "DOMContentLoaded", completed, false );

      // A fallback to window.onload, that will always work
      window.addEventListener( "load", completed, false );

    // If IE event model is used
    } else {
      // Ensure firing before onload, maybe late but safe also for iframes
      document.attachEvent( "onreadystatechange", completed );

      // A fallback to window.onload, that will always work
      window.attachEvent( "onload", completed );

      // If IE and not a frame
      // continually check to see if the document is ready
      var top = false;

      try {
        top = window.frameElement == null && document.documentElement;
      } catch(e) {}

      if ( top && top.doScroll ) {
        (function doScrollCheck() {
          if ( !jQuery.isReady ) {

            try {
              // Use the trick by Diego Perini
              // http://javascript.nwbox.com/IEContentLoaded/
              top.doScroll("left");
            } catch(e) {
              return setTimeout( doScrollCheck, 50 );
            }

            // detach all dom ready events
            detach();

            // and execute any waiting functions
            jQuery.ready();
          }
        })();
      }
    }
  }
  return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
  class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
  var length = obj.length,
    type = jQuery.type( obj );

  if ( jQuery.isWindow( obj ) ) {
    return false;
  }

  if ( obj.nodeType === 1 && length ) {
    return true;
  }

  return type === "array" || type !== "function" &&
    ( length === 0 ||
    typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
  var object = optionsCache[ options ] = {};
  jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
    object[ flag ] = true;
  });
  return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *  options: an optional list of space-separated options that will change how
 *      the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *  once:     will ensure the callback list can only be fired once (like a Deferred)
 *
 *  memory:     will keep track of previous values and will call any callback added
 *          after the list has been fired right away with the latest "memorized"
 *          values (like a Deferred)
 *
 *  unique:     will ensure a callback can only be added once (no duplicate in the list)
 *
 *  stopOnFalse:  interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

  // Convert options from String-formatted to Object-formatted if needed
  // (we check in cache first)
  options = typeof options === "string" ?
    ( optionsCache[ options ] || createOptions( options ) ) :
    jQuery.extend( {}, options );

  var // Flag to know if list is currently firing
    firing,
    // Last fire value (for non-forgettable lists)
    memory,
    // Flag to know if list was already fired
    fired,
    // End of the loop when firing
    firingLength,
    // Index of currently firing callback (modified by remove if needed)
    firingIndex,
    // First callback to fire (used internally by add and fireWith)
    firingStart,
    // Actual callback list
    list = [],
    // Stack of fire calls for repeatable lists
    stack = !options.once && [],
    // Fire callbacks
    fire = function( data ) {
      memory = options.memory && data;
      fired = true;
      firingIndex = firingStart || 0;
      firingStart = 0;
      firingLength = list.length;
      firing = true;
      for ( ; list && firingIndex < firingLength; firingIndex++ ) {
        if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
          memory = false; // To prevent further calls using add
          break;
        }
      }
      firing = false;
      if ( list ) {
        if ( stack ) {
          if ( stack.length ) {
            fire( stack.shift() );
          }
        } else if ( memory ) {
          list = [];
        } else {
          self.disable();
        }
      }
    },
    // Actual Callbacks object
    self = {
      // Add a callback or a collection of callbacks to the list
      add: function() {
        if ( list ) {
          // First, we save the current length
          var start = list.length;
          (function add( args ) {
            jQuery.each( args, function( _, arg ) {
              var type = jQuery.type( arg );
              if ( type === "function" ) {
                if ( !options.unique || !self.has( arg ) ) {
                  list.push( arg );
                }
              } else if ( arg && arg.length && type !== "string" ) {
                // Inspect recursively
                add( arg );
              }
            });
          })( arguments );
          // Do we need to add the callbacks to the
          // current firing batch?
          if ( firing ) {
            firingLength = list.length;
          // With memory, if we're not firing then
          // we should call right away
          } else if ( memory ) {
            firingStart = start;
            fire( memory );
          }
        }
        return this;
      },
      // Remove a callback from the list
      remove: function() {
        if ( list ) {
          jQuery.each( arguments, function( _, arg ) {
            var index;
            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
              list.splice( index, 1 );
              // Handle firing indexes
              if ( firing ) {
                if ( index <= firingLength ) {
                  firingLength--;
                }
                if ( index <= firingIndex ) {
                  firingIndex--;
                }
              }
            }
          });
        }
        return this;
      },
      // Check if a given callback is in the list.
      // If no argument is given, return whether or not list has callbacks attached.
      has: function( fn ) {
        return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
      },
      // Remove all callbacks from the list
      empty: function() {
        list = [];
        return this;
      },
      // Have the list do nothing anymore
      disable: function() {
        list = stack = memory = undefined;
        return this;
      },
      // Is it disabled?
      disabled: function() {
        return !list;
      },
      // Lock the list in its current state
      lock: function() {
        stack = undefined;
        if ( !memory ) {
          self.disable();
        }
        return this;
      },
      // Is it locked?
      locked: function() {
        return !stack;
      },
      // Call all callbacks with the given context and arguments
      fireWith: function( context, args ) {
        args = args || [];
        args = [ context, args.slice ? args.slice() : args ];
        if ( list && ( !fired || stack ) ) {
          if ( firing ) {
            stack.push( args );
          } else {
            fire( args );
          }
        }
        return this;
      },
      // Call all the callbacks with the given arguments
      fire: function() {
        self.fireWith( this, arguments );
        return this;
      },
      // To know if the callbacks have already been called at least once
      fired: function() {
        return !!fired;
      }
    };

  return self;
};
jQuery.extend({

  Deferred: function( func ) {
    var tuples = [
        // action, add listener, listener list, final state
        [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
        [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
        [ "notify", "progress", jQuery.Callbacks("memory") ]
      ],
      state = "pending",
      promise = {
        state: function() {
          return state;
        },
        always: function() {
          deferred.done( arguments ).fail( arguments );
          return this;
        },
        then: function( /* fnDone, fnFail, fnProgress */ ) {
          var fns = arguments;
          return jQuery.Deferred(function( newDefer ) {
            jQuery.each( tuples, function( i, tuple ) {
              var action = tuple[ 0 ],
                fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
              // deferred[ done | fail | progress ] for forwarding actions to newDefer
              deferred[ tuple[1] ](function() {
                var returned = fn && fn.apply( this, arguments );
                if ( returned && jQuery.isFunction( returned.promise ) ) {
                  returned.promise()
                    .done( newDefer.resolve )
                    .fail( newDefer.reject )
                    .progress( newDefer.notify );
                } else {
                  newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
                }
              });
            });
            fns = null;
          }).promise();
        },
        // Get a promise for this deferred
        // If obj is provided, the promise aspect is added to the object
        promise: function( obj ) {
          return obj != null ? jQuery.extend( obj, promise ) : promise;
        }
      },
      deferred = {};

    // Keep pipe for back-compat
    promise.pipe = promise.then;

    // Add list-specific methods
    jQuery.each( tuples, function( i, tuple ) {
      var list = tuple[ 2 ],
        stateString = tuple[ 3 ];

      // promise[ done | fail | progress ] = list.add
      promise[ tuple[1] ] = list.add;

      // Handle state
      if ( stateString ) {
        list.add(function() {
          // state = [ resolved | rejected ]
          state = stateString;

        // [ reject_list | resolve_list ].disable; progress_list.lock
        }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
      }

      // deferred[ resolve | reject | notify ]
      deferred[ tuple[0] ] = function() {
        deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
        return this;
      };
      deferred[ tuple[0] + "With" ] = list.fireWith;
    });

    // Make the deferred a promise
    promise.promise( deferred );

    // Call given func if any
    if ( func ) {
      func.call( deferred, deferred );
    }

    // All done!
    return deferred;
  },

  // Deferred helper
  when: function( subordinate /* , ..., subordinateN */ ) {
    var i = 0,
      resolveValues = core_slice.call( arguments ),
      length = resolveValues.length,

      // the count of uncompleted subordinates
      remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

      // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
      deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

      // Update function for both resolve and progress values
      updateFunc = function( i, contexts, values ) {
        return function( value ) {
          contexts[ i ] = this;
          values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
          if( values === progressValues ) {
            deferred.notifyWith( contexts, values );
          } else if ( !( --remaining ) ) {
            deferred.resolveWith( contexts, values );
          }
        };
      },

      progressValues, progressContexts, resolveContexts;

    // add listeners to Deferred subordinates; treat others as resolved
    if ( length > 1 ) {
      progressValues = new Array( length );
      progressContexts = new Array( length );
      resolveContexts = new Array( length );
      for ( ; i < length; i++ ) {
        if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
          resolveValues[ i ].promise()
            .done( updateFunc( i, resolveContexts, resolveValues ) )
            .fail( deferred.reject )
            .progress( updateFunc( i, progressContexts, progressValues ) );
        } else {
          --remaining;
        }
      }
    }

    // if we're not waiting on anything, resolve the master
    if ( !remaining ) {
      deferred.resolveWith( resolveContexts, resolveValues );
    }

    return deferred.promise();
  }
});
jQuery.support = (function() {

  var support, all, a,
    input, select, fragment,
    opt, eventName, isSupported, i,
    div = document.createElement("div");

  // Setup
  div.setAttribute( "className", "t" );
  div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

  // Support tests won't run in some limited or non-browser environments
  all = div.getElementsByTagName("*");
  a = div.getElementsByTagName("a")[ 0 ];
  if ( !all || !a || !all.length ) {
    return {};
  }

  // First batch of tests
  select = document.createElement("select");
  opt = select.appendChild( document.createElement("option") );
  input = div.getElementsByTagName("input")[ 0 ];

  a.style.cssText = "top:1px;float:left;opacity:.5";
  support = {
    // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
    getSetAttribute: div.className !== "t",

    // IE strips leading whitespace when .innerHTML is used
    leadingWhitespace: div.firstChild.nodeType === 3,

    // Make sure that tbody elements aren't automatically inserted
    // IE will insert them into empty tables
    tbody: !div.getElementsByTagName("tbody").length,

    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    htmlSerialize: !!div.getElementsByTagName("link").length,

    // Get the style information from getAttribute
    // (IE uses .cssText instead)
    style: /top/.test( a.getAttribute("style") ),

    // Make sure that URLs aren't manipulated
    // (IE normalizes it by default)
    hrefNormalized: a.getAttribute("href") === "/a",

    // Make sure that element opacity exists
    // (IE uses filter instead)
    // Use a regex to work around a WebKit issue. See #5145
    opacity: /^0.5/.test( a.style.opacity ),

    // Verify style float existence
    // (IE uses styleFloat instead of cssFloat)
    cssFloat: !!a.style.cssFloat,

    // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
    checkOn: !!input.value,

    // Make sure that a selected-by-default option has a working selected property.
    // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
    optSelected: opt.selected,

    // Tests for enctype support on a form (#6743)
    enctype: !!document.createElement("form").enctype,

    // Makes sure cloning an html5 element does not cause problems
    // Where outerHTML is undefined, this still works
    html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

    // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
    boxModel: document.compatMode === "CSS1Compat",

    // Will be defined later
    deleteExpando: true,
    noCloneEvent: true,
    inlineBlockNeedsLayout: false,
    shrinkWrapBlocks: false,
    reliableMarginRight: true,
    boxSizingReliable: true,
    pixelPosition: false
  };

  // Make sure checked status is properly cloned
  input.checked = true;
  support.noCloneChecked = input.cloneNode( true ).checked;

  // Make sure that the options inside disabled selects aren't marked as disabled
  // (WebKit marks them as disabled)
  select.disabled = true;
  support.optDisabled = !opt.disabled;

  // Support: IE<9
  try {
    delete div.test;
  } catch( e ) {
    support.deleteExpando = false;
  }

  // Check if we can trust getAttribute("value")
  input = document.createElement("input");
  input.setAttribute( "value", "" );
  support.input = input.getAttribute( "value" ) === "";

  // Check if an input maintains its value after becoming a radio
  input.value = "t";
  input.setAttribute( "type", "radio" );
  support.radioValue = input.value === "t";

  // #11217 - WebKit loses check when the name is after the checked attribute
  input.setAttribute( "checked", "t" );
  input.setAttribute( "name", "t" );

  fragment = document.createDocumentFragment();
  fragment.appendChild( input );

  // Check if a disconnected checkbox will retain its checked
  // value of true after appended to the DOM (IE6/7)
  support.appendChecked = input.checked;

  // WebKit doesn't clone checked state correctly in fragments
  support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

  // Support: IE<9
  // Opera does not clone events (and typeof div.attachEvent === undefined).
  // IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
  if ( div.attachEvent ) {
    div.attachEvent( "onclick", function() {
      support.noCloneEvent = false;
    });

    div.cloneNode( true ).click();
  }

  // Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
  // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
  for ( i in { submit: true, change: true, focusin: true }) {
    div.setAttribute( eventName = "on" + i, "t" );

    support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
  }

  div.style.backgroundClip = "content-box";
  div.cloneNode( true ).style.backgroundClip = "";
  support.clearCloneStyle = div.style.backgroundClip === "content-box";

  // Run tests that need a body at doc ready
  jQuery(function() {
    var container, marginDiv, tds,
      divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
      body = document.getElementsByTagName("body")[0];

    if ( !body ) {
      // Return for frameset docs that don't have a body
      return;
    }

    container = document.createElement("div");
    container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

    body.appendChild( container ).appendChild( div );

    // Support: IE8
    // Check if table cells still have offsetWidth/Height when they are set
    // to display:none and there are still other visible table cells in a
    // table row; if so, offsetWidth/Height are not reliable for use when
    // determining if an element has been hidden directly using
    // display:none (it is still safe to use offsets if a parent element is
    // hidden; don safety goggles and see bug #4512 for more information).
    div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
    tds = div.getElementsByTagName("td");
    tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
    isSupported = ( tds[ 0 ].offsetHeight === 0 );

    tds[ 0 ].style.display = "";
    tds[ 1 ].style.display = "none";

    // Support: IE8
    // Check if empty table cells still have offsetWidth/Height
    support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

    // Check box-sizing and margin behavior
    div.innerHTML = "";
    div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
    support.boxSizing = ( div.offsetWidth === 4 );
    support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

    // Use window.getComputedStyle because jsdom on node.js will break without it.
    if ( window.getComputedStyle ) {
      support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
      support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

      // Check if div with explicit width and no margin-right incorrectly
      // gets computed margin-right based on width of container. (#3333)
      // Fails in WebKit before Feb 2011 nightlies
      // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
      marginDiv = div.appendChild( document.createElement("div") );
      marginDiv.style.cssText = div.style.cssText = divReset;
      marginDiv.style.marginRight = marginDiv.style.width = "0";
      div.style.width = "1px";

      support.reliableMarginRight =
        !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
    }

    if ( typeof div.style.zoom !== core_strundefined ) {
      // Support: IE<8
      // Check if natively block-level elements act like inline-block
      // elements when setting their display to 'inline' and giving
      // them layout
      div.innerHTML = "";
      div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
      support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

      // Support: IE6
      // Check if elements with layout shrink-wrap their children
      div.style.display = "block";
      div.innerHTML = "<div></div>";
      div.firstChild.style.width = "5px";
      support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

      if ( support.inlineBlockNeedsLayout ) {
        // Prevent IE 6 from affecting layout for positioned elements #11048
        // Prevent IE from shrinking the body in IE 7 mode #12869
        // Support: IE<8
        body.style.zoom = 1;
      }
    }

    body.removeChild( container );

    // Null elements to avoid leaks in IE
    container = div = tds = marginDiv = null;
  });

  // Null elements to avoid leaks in IE
  all = select = fragment = opt = a = input = null;

  return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
  rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
  if ( !jQuery.acceptData( elem ) ) {
    return;
  }

  var thisCache, ret,
    internalKey = jQuery.expando,
    getByName = typeof name === "string",

    // We have to handle DOM nodes and JS objects differently because IE6-7
    // can't GC object references properly across the DOM-JS boundary
    isNode = elem.nodeType,

    // Only DOM nodes need the global jQuery cache; JS object data is
    // attached directly to the object so GC can occur automatically
    cache = isNode ? jQuery.cache : elem,

    // Only defining an ID for JS objects if its cache already exists allows
    // the code to shortcut on the same path as a DOM node with no cache
    id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

  // Avoid doing any more work than we need to when trying to get data on an
  // object that has no data at all
  if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
    return;
  }

  if ( !id ) {
    // Only DOM nodes need a new unique ID for each element since their data
    // ends up in the global cache
    if ( isNode ) {
      elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
    } else {
      id = internalKey;
    }
  }

  if ( !cache[ id ] ) {
    cache[ id ] = {};

    // Avoids exposing jQuery metadata on plain JS objects when the object
    // is serialized using JSON.stringify
    if ( !isNode ) {
      cache[ id ].toJSON = jQuery.noop;
    }
  }

  // An object can be passed to jQuery.data instead of a key/value pair; this gets
  // shallow copied over onto the existing cache
  if ( typeof name === "object" || typeof name === "function" ) {
    if ( pvt ) {
      cache[ id ] = jQuery.extend( cache[ id ], name );
    } else {
      cache[ id ].data = jQuery.extend( cache[ id ].data, name );
    }
  }

  thisCache = cache[ id ];

  // jQuery data() is stored in a separate object inside the object's internal data
  // cache in order to avoid key collisions between internal data and user-defined
  // data.
  if ( !pvt ) {
    if ( !thisCache.data ) {
      thisCache.data = {};
    }

    thisCache = thisCache.data;
  }

  if ( data !== undefined ) {
    thisCache[ jQuery.camelCase( name ) ] = data;
  }

  // Check for both converted-to-camel and non-converted data property names
  // If a data property was specified
  if ( getByName ) {

    // First Try to find as-is property data
    ret = thisCache[ name ];

    // Test for null|undefined property data
    if ( ret == null ) {

      // Try to find the camelCased property
      ret = thisCache[ jQuery.camelCase( name ) ];
    }
  } else {
    ret = thisCache;
  }

  return ret;
}

function internalRemoveData( elem, name, pvt ) {
  if ( !jQuery.acceptData( elem ) ) {
    return;
  }

  var i, l, thisCache,
    isNode = elem.nodeType,

    // See jQuery.data for more information
    cache = isNode ? jQuery.cache : elem,
    id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

  // If there is already no cache entry for this object, there is no
  // purpose in continuing
  if ( !cache[ id ] ) {
    return;
  }

  if ( name ) {

    thisCache = pvt ? cache[ id ] : cache[ id ].data;

    if ( thisCache ) {

      // Support array or space separated string names for data keys
      if ( !jQuery.isArray( name ) ) {

        // try the string as a key before any manipulation
        if ( name in thisCache ) {
          name = [ name ];
        } else {

          // split the camel cased version by spaces unless a key with the spaces exists
          name = jQuery.camelCase( name );
          if ( name in thisCache ) {
            name = [ name ];
          } else {
            name = name.split(" ");
          }
        }
      } else {
        // If "name" is an array of keys...
        // When data is initially created, via ("key", "val") signature,
        // keys will be converted to camelCase.
        // Since there is no way to tell _how_ a key was added, remove
        // both plain key and camelCase key. #12786
        // This will only penalize the array argument path.
        name = name.concat( jQuery.map( name, jQuery.camelCase ) );
      }

      for ( i = 0, l = name.length; i < l; i++ ) {
        delete thisCache[ name[i] ];
      }

      // If there is no data left in the cache, we want to continue
      // and let the cache object itself get destroyed
      if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
        return;
      }
    }
  }

  // See jQuery.data for more information
  if ( !pvt ) {
    delete cache[ id ].data;

    // Don't destroy the parent cache unless the internal data object
    // had been the only thing left in it
    if ( !isEmptyDataObject( cache[ id ] ) ) {
      return;
    }
  }

  // Destroy the cache
  if ( isNode ) {
    jQuery.cleanData( [ elem ], true );

  // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
  } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
    delete cache[ id ];

  // When all else fails, null
  } else {
    cache[ id ] = null;
  }
}

jQuery.extend({
  cache: {},

  // Unique for each copy of jQuery on the page
  // Non-digits removed to match rinlinejQuery
  expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

  // The following elements throw uncatchable exceptions if you
  // attempt to add expando properties to them.
  noData: {
    "embed": true,
    // Ban all objects except for Flash (which handle expandos)
    "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
    "applet": true
  },

  hasData: function( elem ) {
    elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
    return !!elem && !isEmptyDataObject( elem );
  },

  data: function( elem, name, data ) {
    return internalData( elem, name, data );
  },

  removeData: function( elem, name ) {
    return internalRemoveData( elem, name );
  },

  // For internal use only.
  _data: function( elem, name, data ) {
    return internalData( elem, name, data, true );
  },

  _removeData: function( elem, name ) {
    return internalRemoveData( elem, name, true );
  },

  // A method for determining if a DOM node can handle the data expando
  acceptData: function( elem ) {
    // Do not set data on non-element because it will not be cleared (#8335).
    if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
      return false;
    }

    var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

    // nodes accept data unless otherwise specified; rejection can be conditional
    return !noData || noData !== true && elem.getAttribute("classid") === noData;
  }
});

jQuery.fn.extend({
  data: function( key, value ) {
    var attrs, name,
      elem = this[0],
      i = 0,
      data = null;

    // Gets all values
    if ( key === undefined ) {
      if ( this.length ) {
        data = jQuery.data( elem );

        if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
          attrs = elem.attributes;
          for ( ; i < attrs.length; i++ ) {
            name = attrs[i].name;

            if ( !name.indexOf( "data-" ) ) {
              name = jQuery.camelCase( name.slice(5) );

              dataAttr( elem, name, data[ name ] );
            }
          }
          jQuery._data( elem, "parsedAttrs", true );
        }
      }

      return data;
    }

    // Sets multiple values
    if ( typeof key === "object" ) {
      return this.each(function() {
        jQuery.data( this, key );
      });
    }

    return jQuery.access( this, function( value ) {

      if ( value === undefined ) {
        // Try to fetch any internally stored data first
        return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
      }

      this.each(function() {
        jQuery.data( this, key, value );
      });
    }, null, value, arguments.length > 1, null, true );
  },

  removeData: function( key ) {
    return this.each(function() {
      jQuery.removeData( this, key );
    });
  }
});

function dataAttr( elem, key, data ) {
  // If nothing was found internally, try to fetch any
  // data from the HTML5 data-* attribute
  if ( data === undefined && elem.nodeType === 1 ) {

    var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

    data = elem.getAttribute( name );

    if ( typeof data === "string" ) {
      try {
        data = data === "true" ? true :
          data === "false" ? false :
          data === "null" ? null :
          // Only convert to a number if it doesn't change the string
          +data + "" === data ? +data :
          rbrace.test( data ) ? jQuery.parseJSON( data ) :
            data;
      } catch( e ) {}

      // Make sure we set the data so it isn't changed later
      jQuery.data( elem, key, data );

    } else {
      data = undefined;
    }
  }

  return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
  var name;
  for ( name in obj ) {

    // if the public data object is empty, the private is still empty
    if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
      continue;
    }
    if ( name !== "toJSON" ) {
      return false;
    }
  }

  return true;
}
jQuery.extend({
  queue: function( elem, type, data ) {
    var queue;

    if ( elem ) {
      type = ( type || "fx" ) + "queue";
      queue = jQuery._data( elem, type );

      // Speed up dequeue by getting out quickly if this is just a lookup
      if ( data ) {
        if ( !queue || jQuery.isArray(data) ) {
          queue = jQuery._data( elem, type, jQuery.makeArray(data) );
        } else {
          queue.push( data );
        }
      }
      return queue || [];
    }
  },

  dequeue: function( elem, type ) {
    type = type || "fx";

    var queue = jQuery.queue( elem, type ),
      startLength = queue.length,
      fn = queue.shift(),
      hooks = jQuery._queueHooks( elem, type ),
      next = function() {
        jQuery.dequeue( elem, type );
      };

    // If the fx queue is dequeued, always remove the progress sentinel
    if ( fn === "inprogress" ) {
      fn = queue.shift();
      startLength--;
    }

    hooks.cur = fn;
    if ( fn ) {

      // Add a progress sentinel to prevent the fx queue from being
      // automatically dequeued
      if ( type === "fx" ) {
        queue.unshift( "inprogress" );
      }

      // clear up the last queue stop function
      delete hooks.stop;
      fn.call( elem, next, hooks );
    }

    if ( !startLength && hooks ) {
      hooks.empty.fire();
    }
  },

  // not intended for public consumption - generates a queueHooks object, or returns the current one
  _queueHooks: function( elem, type ) {
    var key = type + "queueHooks";
    return jQuery._data( elem, key ) || jQuery._data( elem, key, {
      empty: jQuery.Callbacks("once memory").add(function() {
        jQuery._removeData( elem, type + "queue" );
        jQuery._removeData( elem, key );
      })
    });
  }
});

jQuery.fn.extend({
  queue: function( type, data ) {
    var setter = 2;

    if ( typeof type !== "string" ) {
      data = type;
      type = "fx";
      setter--;
    }

    if ( arguments.length < setter ) {
      return jQuery.queue( this[0], type );
    }

    return data === undefined ?
      this :
      this.each(function() {
        var queue = jQuery.queue( this, type, data );

        // ensure a hooks for this queue
        jQuery._queueHooks( this, type );

        if ( type === "fx" && queue[0] !== "inprogress" ) {
          jQuery.dequeue( this, type );
        }
      });
  },
  dequeue: function( type ) {
    return this.each(function() {
      jQuery.dequeue( this, type );
    });
  },
  // Based off of the plugin by Clint Helfers, with permission.
  // http://blindsignals.com/index.php/2009/07/jquery-delay/
  delay: function( time, type ) {
    time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    type = type || "fx";

    return this.queue( type, function( next, hooks ) {
      var timeout = setTimeout( next, time );
      hooks.stop = function() {
        clearTimeout( timeout );
      };
    });
  },
  clearQueue: function( type ) {
    return this.queue( type || "fx", [] );
  },
  // Get a promise resolved when queues of a certain type
  // are emptied (fx is the type by default)
  promise: function( type, obj ) {
    var tmp,
      count = 1,
      defer = jQuery.Deferred(),
      elements = this,
      i = this.length,
      resolve = function() {
        if ( !( --count ) ) {
          defer.resolveWith( elements, [ elements ] );
        }
      };

    if ( typeof type !== "string" ) {
      obj = type;
      type = undefined;
    }
    type = type || "fx";

    while( i-- ) {
      tmp = jQuery._data( elements[ i ], type + "queueHooks" );
      if ( tmp && tmp.empty ) {
        count++;
        tmp.empty.add( resolve );
      }
    }
    resolve();
    return defer.promise( obj );
  }
});
var nodeHook, boolHook,
  rclass = /[\t\r\n]/g,
  rreturn = /\r/g,
  rfocusable = /^(?:input|select|textarea|button|object)$/i,
  rclickable = /^(?:a|area)$/i,
  rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
  ruseDefault = /^(?:checked|selected)$/i,
  getSetAttribute = jQuery.support.getSetAttribute,
  getSetInput = jQuery.support.input;

jQuery.fn.extend({
  attr: function( name, value ) {
    return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
  },

  removeAttr: function( name ) {
    return this.each(function() {
      jQuery.removeAttr( this, name );
    });
  },

  prop: function( name, value ) {
    return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
  },

  removeProp: function( name ) {
    name = jQuery.propFix[ name ] || name;
    return this.each(function() {
      // try/catch handles cases where IE balks (such as removing a property on window)
      try {
        this[ name ] = undefined;
        delete this[ name ];
      } catch( e ) {}
    });
  },

  addClass: function( value ) {
    var classes, elem, cur, clazz, j,
      i = 0,
      len = this.length,
      proceed = typeof value === "string" && value;

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).addClass( value.call( this, j, this.className ) );
      });
    }

    if ( proceed ) {
      // The disjunction here is for better compressibility (see removeClass)
      classes = ( value || "" ).match( core_rnotwhite ) || [];

      for ( ; i < len; i++ ) {
        elem = this[ i ];
        cur = elem.nodeType === 1 && ( elem.className ?
          ( " " + elem.className + " " ).replace( rclass, " " ) :
          " "
        );

        if ( cur ) {
          j = 0;
          while ( (clazz = classes[j++]) ) {
            if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
              cur += clazz + " ";
            }
          }
          elem.className = jQuery.trim( cur );

        }
      }
    }

    return this;
  },

  removeClass: function( value ) {
    var classes, elem, cur, clazz, j,
      i = 0,
      len = this.length,
      proceed = arguments.length === 0 || typeof value === "string" && value;

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).removeClass( value.call( this, j, this.className ) );
      });
    }
    if ( proceed ) {
      classes = ( value || "" ).match( core_rnotwhite ) || [];

      for ( ; i < len; i++ ) {
        elem = this[ i ];
        // This expression is here for better compressibility (see addClass)
        cur = elem.nodeType === 1 && ( elem.className ?
          ( " " + elem.className + " " ).replace( rclass, " " ) :
          ""
        );

        if ( cur ) {
          j = 0;
          while ( (clazz = classes[j++]) ) {
            // Remove *all* instances
            while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
              cur = cur.replace( " " + clazz + " ", " " );
            }
          }
          elem.className = value ? jQuery.trim( cur ) : "";
        }
      }
    }

    return this;
  },

  toggleClass: function( value, stateVal ) {
    var type = typeof value,
      isBool = typeof stateVal === "boolean";

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( i ) {
        jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
      });
    }

    return this.each(function() {
      if ( type === "string" ) {
        // toggle individual class names
        var className,
          i = 0,
          self = jQuery( this ),
          state = stateVal,
          classNames = value.match( core_rnotwhite ) || [];

        while ( (className = classNames[ i++ ]) ) {
          // check each className given, space separated list
          state = isBool ? state : !self.hasClass( className );
          self[ state ? "addClass" : "removeClass" ]( className );
        }

      // Toggle whole class name
      } else if ( type === core_strundefined || type === "boolean" ) {
        if ( this.className ) {
          // store className if set
          jQuery._data( this, "__className__", this.className );
        }

        // If the element has a class name or if we're passed "false",
        // then remove the whole classname (if there was one, the above saved it).
        // Otherwise bring back whatever was previously saved (if anything),
        // falling back to the empty string if nothing was stored.
        this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
      }
    });
  },

  hasClass: function( selector ) {
    var className = " " + selector + " ",
      i = 0,
      l = this.length;
    for ( ; i < l; i++ ) {
      if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
        return true;
      }
    }

    return false;
  },

  val: function( value ) {
    var ret, hooks, isFunction,
      elem = this[0];

    if ( !arguments.length ) {
      if ( elem ) {
        hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

        if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
          return ret;
        }

        ret = elem.value;

        return typeof ret === "string" ?
          // handle most common string cases
          ret.replace(rreturn, "") :
          // handle cases where value is null/undef or number
          ret == null ? "" : ret;
      }

      return;
    }

    isFunction = jQuery.isFunction( value );

    return this.each(function( i ) {
      var val,
        self = jQuery(this);

      if ( this.nodeType !== 1 ) {
        return;
      }

      if ( isFunction ) {
        val = value.call( this, i, self.val() );
      } else {
        val = value;
      }

      // Treat null/undefined as ""; convert numbers to string
      if ( val == null ) {
        val = "";
      } else if ( typeof val === "number" ) {
        val += "";
      } else if ( jQuery.isArray( val ) ) {
        val = jQuery.map(val, function ( value ) {
          return value == null ? "" : value + "";
        });
      }

      hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

      // If set returns undefined, fall back to normal setting
      if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
        this.value = val;
      }
    });
  }
});

jQuery.extend({
  valHooks: {
    option: {
      get: function( elem ) {
        // attributes.value is undefined in Blackberry 4.7 but
        // uses .value. See #6932
        var val = elem.attributes.value;
        return !val || val.specified ? elem.value : elem.text;
      }
    },
    select: {
      get: function( elem ) {
        var value, option,
          options = elem.options,
          index = elem.selectedIndex,
          one = elem.type === "select-one" || index < 0,
          values = one ? null : [],
          max = one ? index + 1 : options.length,
          i = index < 0 ?
            max :
            one ? index : 0;

        // Loop through all the selected options
        for ( ; i < max; i++ ) {
          option = options[ i ];

          // oldIE doesn't update selected after form reset (#2551)
          if ( ( option.selected || i === index ) &&
              // Don't return options that are disabled or in a disabled optgroup
              ( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
              ( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

            // Get the specific value for the option
            value = jQuery( option ).val();

            // We don't need an array for one selects
            if ( one ) {
              return value;
            }

            // Multi-Selects return an array
            values.push( value );
          }
        }

        return values;
      },

      set: function( elem, value ) {
        var values = jQuery.makeArray( value );

        jQuery(elem).find("option").each(function() {
          this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
        });

        if ( !values.length ) {
          elem.selectedIndex = -1;
        }
        return values;
      }
    }
  },

  attr: function( elem, name, value ) {
    var hooks, notxml, ret,
      nType = elem.nodeType;

    // don't get/set attributes on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return;
    }

    // Fallback to prop when attributes are not supported
    if ( typeof elem.getAttribute === core_strundefined ) {
      return jQuery.prop( elem, name, value );
    }

    notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    // All attributes are lowercase
    // Grab necessary hook if one is defined
    if ( notxml ) {
      name = name.toLowerCase();
      hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
    }

    if ( value !== undefined ) {

      if ( value === null ) {
        jQuery.removeAttr( elem, name );

      } else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        elem.setAttribute( name, value + "" );
        return value;
      }

    } else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
      return ret;

    } else {

      // In IE9+, Flash objects don't have .getAttribute (#12945)
      // Support: IE9+
      if ( typeof elem.getAttribute !== core_strundefined ) {
        ret =  elem.getAttribute( name );
      }

      // Non-existent attributes return null, we normalize to undefined
      return ret == null ?
        undefined :
        ret;
    }
  },

  removeAttr: function( elem, value ) {
    var name, propName,
      i = 0,
      attrNames = value && value.match( core_rnotwhite );

    if ( attrNames && elem.nodeType === 1 ) {
      while ( (name = attrNames[i++]) ) {
        propName = jQuery.propFix[ name ] || name;

        // Boolean attributes get special treatment (#10870)
        if ( rboolean.test( name ) ) {
          // Set corresponding property to false for boolean attributes
          // Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
          if ( !getSetAttribute && ruseDefault.test( name ) ) {
            elem[ jQuery.camelCase( "default-" + name ) ] =
              elem[ propName ] = false;
          } else {
            elem[ propName ] = false;
          }

        // See #9699 for explanation of this approach (setting first, then removal)
        } else {
          jQuery.attr( elem, name, "" );
        }

        elem.removeAttribute( getSetAttribute ? name : propName );
      }
    }
  },

  attrHooks: {
    type: {
      set: function( elem, value ) {
        if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
          // Setting the type on a radio button after the value resets the value in IE6-9
          // Reset value to default in case type is set after value during creation
          var val = elem.value;
          elem.setAttribute( "type", value );
          if ( val ) {
            elem.value = val;
          }
          return value;
        }
      }
    }
  },

  propFix: {
    tabindex: "tabIndex",
    readonly: "readOnly",
    "for": "htmlFor",
    "class": "className",
    maxlength: "maxLength",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable"
  },

  prop: function( elem, name, value ) {
    var ret, hooks, notxml,
      nType = elem.nodeType;

    // don't get/set properties on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return;
    }

    notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    if ( notxml ) {
      // Fix name and attach hooks
      name = jQuery.propFix[ name ] || name;
      hooks = jQuery.propHooks[ name ];
    }

    if ( value !== undefined ) {
      if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        return ( elem[ name ] = value );
      }

    } else {
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
        return ret;

      } else {
        return elem[ name ];
      }
    }
  },

  propHooks: {
    tabIndex: {
      get: function( elem ) {
        // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
        // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
        var attributeNode = elem.getAttributeNode("tabindex");

        return attributeNode && attributeNode.specified ?
          parseInt( attributeNode.value, 10 ) :
          rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
            0 :
            undefined;
      }
    }
  }
});

// Hook for boolean attributes
boolHook = {
  get: function( elem, name ) {
    var
      // Use .prop to determine if this attribute is understood as boolean
      prop = jQuery.prop( elem, name ),

      // Fetch it accordingly
      attr = typeof prop === "boolean" && elem.getAttribute( name ),
      detail = typeof prop === "boolean" ?

        getSetInput && getSetAttribute ?
          attr != null :
          // oldIE fabricates an empty string for missing boolean attributes
          // and conflates checked/selected into attroperties
          ruseDefault.test( name ) ?
            elem[ jQuery.camelCase( "default-" + name ) ] :
            !!attr :

        // fetch an attribute node for properties not recognized as boolean
        elem.getAttributeNode( name );

    return detail && detail.value !== false ?
      name.toLowerCase() :
      undefined;
  },
  set: function( elem, value, name ) {
    if ( value === false ) {
      // Remove boolean attributes when set to false
      jQuery.removeAttr( elem, name );
    } else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
      // IE<8 needs the *property* name
      elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

    // Use defaultChecked and defaultSelected for oldIE
    } else {
      elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
    }

    return name;
  }
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
  jQuery.attrHooks.value = {
    get: function( elem, name ) {
      var ret = elem.getAttributeNode( name );
      return jQuery.nodeName( elem, "input" ) ?

        // Ignore the value *property* by using defaultValue
        elem.defaultValue :

        ret && ret.specified ? ret.value : undefined;
    },
    set: function( elem, value, name ) {
      if ( jQuery.nodeName( elem, "input" ) ) {
        // Does not return so that setAttribute is also used
        elem.defaultValue = value;
      } else {
        // Use nodeHook if defined (#1954); otherwise setAttribute is fine
        return nodeHook && nodeHook.set( elem, value, name );
      }
    }
  };
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

  // Use this for any attribute in IE6/7
  // This fixes almost every IE6/7 issue
  nodeHook = jQuery.valHooks.button = {
    get: function( elem, name ) {
      var ret = elem.getAttributeNode( name );
      return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
        ret.value :
        undefined;
    },
    set: function( elem, value, name ) {
      // Set the existing or create a new attribute node
      var ret = elem.getAttributeNode( name );
      if ( !ret ) {
        elem.setAttributeNode(
          (ret = elem.ownerDocument.createAttribute( name ))
        );
      }

      ret.value = value += "";

      // Break association with cloned elements by also using setAttribute (#9646)
      return name === "value" || value === elem.getAttribute( name ) ?
        value :
        undefined;
    }
  };

  // Set contenteditable to false on removals(#10429)
  // Setting to empty string throws an error as an invalid value
  jQuery.attrHooks.contenteditable = {
    get: nodeHook.get,
    set: function( elem, value, name ) {
      nodeHook.set( elem, value === "" ? false : value, name );
    }
  };

  // Set width and height to auto instead of 0 on empty string( Bug #8150 )
  // This is for removals
  jQuery.each([ "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      set: function( elem, value ) {
        if ( value === "" ) {
          elem.setAttribute( name, "auto" );
          return value;
        }
      }
    });
  });
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
  jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      get: function( elem ) {
        var ret = elem.getAttribute( name, 2 );
        return ret == null ? undefined : ret;
      }
    });
  });

  // href/src property should get the full normalized URL (#10299/#12915)
  jQuery.each([ "href", "src" ], function( i, name ) {
    jQuery.propHooks[ name ] = {
      get: function( elem ) {
        return elem.getAttribute( name, 4 );
      }
    };
  });
}

if ( !jQuery.support.style ) {
  jQuery.attrHooks.style = {
    get: function( elem ) {
      // Return undefined in the case of empty string
      // Note: IE uppercases css property names, but if we were to .toLowerCase()
      // .cssText, that would destroy case senstitivity in URL's, like in "background"
      return elem.style.cssText || undefined;
    },
    set: function( elem, value ) {
      return ( elem.style.cssText = value + "" );
    }
  };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
  jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
    get: function( elem ) {
      var parent = elem.parentNode;

      if ( parent ) {
        parent.selectedIndex;

        // Make sure that it also works with optgroups, see #5701
        if ( parent.parentNode ) {
          parent.parentNode.selectedIndex;
        }
      }
      return null;
    }
  });
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
  jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
  jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = {
      get: function( elem ) {
        // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
        return elem.getAttribute("value") === null ? "on" : elem.value;
      }
    };
  });
}
jQuery.each([ "radio", "checkbox" ], function() {
  jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
    set: function( elem, value ) {
      if ( jQuery.isArray( value ) ) {
        return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
      }
    }
  });
});
var rformElems = /^(?:input|select|textarea)$/i,
  rkeyEvent = /^key/,
  rmouseEvent = /^(?:mouse|contextmenu)|click/,
  rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
  rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
  return true;
}

function returnFalse() {
  return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

  global: {},

  add: function( elem, types, handler, data, selector ) {
    var tmp, events, t, handleObjIn,
      special, eventHandle, handleObj,
      handlers, type, namespaces, origType,
      elemData = jQuery._data( elem );

    // Don't attach events to noData or text/comment nodes (but allow plain objects)
    if ( !elemData ) {
      return;
    }

    // Caller can pass in an object of custom data in lieu of the handler
    if ( handler.handler ) {
      handleObjIn = handler;
      handler = handleObjIn.handler;
      selector = handleObjIn.selector;
    }

    // Make sure that the handler has a unique ID, used to find/remove it later
    if ( !handler.guid ) {
      handler.guid = jQuery.guid++;
    }

    // Init the element's event structure and main handler, if this is the first
    if ( !(events = elemData.events) ) {
      events = elemData.events = {};
    }
    if ( !(eventHandle = elemData.handle) ) {
      eventHandle = elemData.handle = function( e ) {
        // Discard the second event of a jQuery.event.trigger() and
        // when an event is called after a page has unloaded
        return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
          jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
          undefined;
      };
      // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
      eventHandle.elem = elem;
    }

    // Handle multiple events separated by a space
    // jQuery(...).bind("mouseover mouseout", fn);
    types = ( types || "" ).match( core_rnotwhite ) || [""];
    t = types.length;
    while ( t-- ) {
      tmp = rtypenamespace.exec( types[t] ) || [];
      type = origType = tmp[1];
      namespaces = ( tmp[2] || "" ).split( "." ).sort();

      // If event changes its type, use the special event handlers for the changed type
      special = jQuery.event.special[ type ] || {};

      // If selector defined, determine special event api type, otherwise given type
      type = ( selector ? special.delegateType : special.bindType ) || type;

      // Update special based on newly reset type
      special = jQuery.event.special[ type ] || {};

      // handleObj is passed to all event handlers
      handleObj = jQuery.extend({
        type: type,
        origType: origType,
        data: data,
        handler: handler,
        guid: handler.guid,
        selector: selector,
        needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
        namespace: namespaces.join(".")
      }, handleObjIn );

      // Init the event handler queue if we're the first
      if ( !(handlers = events[ type ]) ) {
        handlers = events[ type ] = [];
        handlers.delegateCount = 0;

        // Only use addEventListener/attachEvent if the special events handler returns false
        if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
          // Bind the global event handler to the element
          if ( elem.addEventListener ) {
            elem.addEventListener( type, eventHandle, false );

          } else if ( elem.attachEvent ) {
            elem.attachEvent( "on" + type, eventHandle );
          }
        }
      }

      if ( special.add ) {
        special.add.call( elem, handleObj );

        if ( !handleObj.handler.guid ) {
          handleObj.handler.guid = handler.guid;
        }
      }

      // Add to the element's handler list, delegates in front
      if ( selector ) {
        handlers.splice( handlers.delegateCount++, 0, handleObj );
      } else {
        handlers.push( handleObj );
      }

      // Keep track of which events have ever been used, for event optimization
      jQuery.event.global[ type ] = true;
    }

    // Nullify elem to prevent memory leaks in IE
    elem = null;
  },

  // Detach an event or set of events from an element
  remove: function( elem, types, handler, selector, mappedTypes ) {
    var j, handleObj, tmp,
      origCount, t, events,
      special, handlers, type,
      namespaces, origType,
      elemData = jQuery.hasData( elem ) && jQuery._data( elem );

    if ( !elemData || !(events = elemData.events) ) {
      return;
    }

    // Once for each type.namespace in types; type may be omitted
    types = ( types || "" ).match( core_rnotwhite ) || [""];
    t = types.length;
    while ( t-- ) {
      tmp = rtypenamespace.exec( types[t] ) || [];
      type = origType = tmp[1];
      namespaces = ( tmp[2] || "" ).split( "." ).sort();

      // Unbind all events (on this namespace, if provided) for the element
      if ( !type ) {
        for ( type in events ) {
          jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
        }
        continue;
      }

      special = jQuery.event.special[ type ] || {};
      type = ( selector ? special.delegateType : special.bindType ) || type;
      handlers = events[ type ] || [];
      tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

      // Remove matching events
      origCount = j = handlers.length;
      while ( j-- ) {
        handleObj = handlers[ j ];

        if ( ( mappedTypes || origType === handleObj.origType ) &&
          ( !handler || handler.guid === handleObj.guid ) &&
          ( !tmp || tmp.test( handleObj.namespace ) ) &&
          ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
          handlers.splice( j, 1 );

          if ( handleObj.selector ) {
            handlers.delegateCount--;
          }
          if ( special.remove ) {
            special.remove.call( elem, handleObj );
          }
        }
      }

      // Remove generic event handler if we removed something and no more handlers exist
      // (avoids potential for endless recursion during removal of special event handlers)
      if ( origCount && !handlers.length ) {
        if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
          jQuery.removeEvent( elem, type, elemData.handle );
        }

        delete events[ type ];
      }
    }

    // Remove the expando if it's no longer used
    if ( jQuery.isEmptyObject( events ) ) {
      delete elemData.handle;

      // removeData also checks for emptiness and clears the expando if empty
      // so use it instead of delete
      jQuery._removeData( elem, "events" );
    }
  },

  trigger: function( event, data, elem, onlyHandlers ) {
    var handle, ontype, cur,
      bubbleType, special, tmp, i,
      eventPath = [ elem || document ],
      type = core_hasOwn.call( event, "type" ) ? event.type : event,
      namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

    cur = tmp = elem = elem || document;

    // Don't do events on text and comment nodes
    if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
      return;
    }

    // focus/blur morphs to focusin/out; ensure we're not firing them right now
    if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
      return;
    }

    if ( type.indexOf(".") >= 0 ) {
      // Namespaced trigger; create a regexp to match event type in handle()
      namespaces = type.split(".");
      type = namespaces.shift();
      namespaces.sort();
    }
    ontype = type.indexOf(":") < 0 && "on" + type;

    // Caller can pass in a jQuery.Event object, Object, or just an event type string
    event = event[ jQuery.expando ] ?
      event :
      new jQuery.Event( type, typeof event === "object" && event );

    event.isTrigger = true;
    event.namespace = namespaces.join(".");
    event.namespace_re = event.namespace ?
      new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
      null;

    // Clean up the event in case it is being reused
    event.result = undefined;
    if ( !event.target ) {
      event.target = elem;
    }

    // Clone any incoming data and prepend the event, creating the handler arg list
    data = data == null ?
      [ event ] :
      jQuery.makeArray( data, [ event ] );

    // Allow special events to draw outside the lines
    special = jQuery.event.special[ type ] || {};
    if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
      return;
    }

    // Determine event propagation path in advance, per W3C events spec (#9951)
    // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
    if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

      bubbleType = special.delegateType || type;
      if ( !rfocusMorph.test( bubbleType + type ) ) {
        cur = cur.parentNode;
      }
      for ( ; cur; cur = cur.parentNode ) {
        eventPath.push( cur );
        tmp = cur;
      }

      // Only add window if we got to document (e.g., not plain obj or detached DOM)
      if ( tmp === (elem.ownerDocument || document) ) {
        eventPath.push( tmp.defaultView || tmp.parentWindow || window );
      }
    }

    // Fire handlers on the event path
    i = 0;
    while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

      event.type = i > 1 ?
        bubbleType :
        special.bindType || type;

      // jQuery handler
      handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
      if ( handle ) {
        handle.apply( cur, data );
      }

      // Native handler
      handle = ontype && cur[ ontype ];
      if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
        event.preventDefault();
      }
    }
    event.type = type;

    // If nobody prevented the default action, do it now
    if ( !onlyHandlers && !event.isDefaultPrevented() ) {

      if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
        !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

        // Call a native DOM method on the target with the same name name as the event.
        // Can't use an .isFunction() check here because IE6/7 fails that test.
        // Don't do default actions on window, that's where global variables be (#6170)
        if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

          // Don't re-trigger an onFOO event when we call its FOO() method
          tmp = elem[ ontype ];

          if ( tmp ) {
            elem[ ontype ] = null;
          }

          // Prevent re-triggering of the same event, since we already bubbled it above
          jQuery.event.triggered = type;
          try {
            elem[ type ]();
          } catch ( e ) {
            // IE<9 dies on focus/blur to hidden element (#1486,#12518)
            // only reproducible on winXP IE8 native, not IE9 in IE8 mode
          }
          jQuery.event.triggered = undefined;

          if ( tmp ) {
            elem[ ontype ] = tmp;
          }
        }
      }
    }

    return event.result;
  },

  dispatch: function( event ) {

    // Make a writable jQuery.Event from the native event object
    event = jQuery.event.fix( event );

    var i, ret, handleObj, matched, j,
      handlerQueue = [],
      args = core_slice.call( arguments ),
      handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
      special = jQuery.event.special[ event.type ] || {};

    // Use the fix-ed jQuery.Event rather than the (read-only) native event
    args[0] = event;
    event.delegateTarget = this;

    // Call the preDispatch hook for the mapped type, and let it bail if desired
    if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
      return;
    }

    // Determine handlers
    handlerQueue = jQuery.event.handlers.call( this, event, handlers );

    // Run delegates first; they may want to stop propagation beneath us
    i = 0;
    while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
      event.currentTarget = matched.elem;

      j = 0;
      while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

        // Triggered event must either 1) have no namespace, or
        // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
        if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

          event.handleObj = handleObj;
          event.data = handleObj.data;

          ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
              .apply( matched.elem, args );

          if ( ret !== undefined ) {
            if ( (event.result = ret) === false ) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }
      }
    }

    // Call the postDispatch hook for the mapped type
    if ( special.postDispatch ) {
      special.postDispatch.call( this, event );
    }

    return event.result;
  },

  handlers: function( event, handlers ) {
    var sel, handleObj, matches, i,
      handlerQueue = [],
      delegateCount = handlers.delegateCount,
      cur = event.target;

    // Find delegate handlers
    // Black-hole SVG <use> instance trees (#13180)
    // Avoid non-left-click bubbling in Firefox (#3861)
    if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

      for ( ; cur != this; cur = cur.parentNode || this ) {

        // Don't check non-elements (#13208)
        // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
        if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
          matches = [];
          for ( i = 0; i < delegateCount; i++ ) {
            handleObj = handlers[ i ];

            // Don't conflict with Object.prototype properties (#13203)
            sel = handleObj.selector + " ";

            if ( matches[ sel ] === undefined ) {
              matches[ sel ] = handleObj.needsContext ?
                jQuery( sel, this ).index( cur ) >= 0 :
                jQuery.find( sel, this, null, [ cur ] ).length;
            }
            if ( matches[ sel ] ) {
              matches.push( handleObj );
            }
          }
          if ( matches.length ) {
            handlerQueue.push({ elem: cur, handlers: matches });
          }
        }
      }
    }

    // Add the remaining (directly-bound) handlers
    if ( delegateCount < handlers.length ) {
      handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
    }

    return handlerQueue;
  },

  fix: function( event ) {
    if ( event[ jQuery.expando ] ) {
      return event;
    }

    // Create a writable copy of the event object and normalize some properties
    var i, prop, copy,
      type = event.type,
      originalEvent = event,
      fixHook = this.fixHooks[ type ];

    if ( !fixHook ) {
      this.fixHooks[ type ] = fixHook =
        rmouseEvent.test( type ) ? this.mouseHooks :
        rkeyEvent.test( type ) ? this.keyHooks :
        {};
    }
    copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

    event = new jQuery.Event( originalEvent );

    i = copy.length;
    while ( i-- ) {
      prop = copy[ i ];
      event[ prop ] = originalEvent[ prop ];
    }

    // Support: IE<9
    // Fix target property (#1925)
    if ( !event.target ) {
      event.target = originalEvent.srcElement || document;
    }

    // Support: Chrome 23+, Safari?
    // Target should not be a text node (#504, #13143)
    if ( event.target.nodeType === 3 ) {
      event.target = event.target.parentNode;
    }

    // Support: IE<9
    // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
    event.metaKey = !!event.metaKey;

    return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
  },

  // Includes some event props shared by KeyEvent and MouseEvent
  props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

  fixHooks: {},

  keyHooks: {
    props: "char charCode key keyCode".split(" "),
    filter: function( event, original ) {

      // Add which for key events
      if ( event.which == null ) {
        event.which = original.charCode != null ? original.charCode : original.keyCode;
      }

      return event;
    }
  },

  mouseHooks: {
    props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
    filter: function( event, original ) {
      var body, eventDoc, doc,
        button = original.button,
        fromElement = original.fromElement;

      // Calculate pageX/Y if missing and clientX/Y available
      if ( event.pageX == null && original.clientX != null ) {
        eventDoc = event.target.ownerDocument || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
        event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
      }

      // Add relatedTarget, if necessary
      if ( !event.relatedTarget && fromElement ) {
        event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
      }

      // Add which for click: 1 === left; 2 === middle; 3 === right
      // Note: button is not normalized, so don't use it
      if ( !event.which && button !== undefined ) {
        event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
      }

      return event;
    }
  },

  special: {
    load: {
      // Prevent triggered image.load events from bubbling to window.load
      noBubble: true
    },
    click: {
      // For checkbox, fire native event so checked state will be right
      trigger: function() {
        if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
          this.click();
          return false;
        }
      }
    },
    focus: {
      // Fire native event if possible so blur/focus sequence is correct
      trigger: function() {
        if ( this !== document.activeElement && this.focus ) {
          try {
            this.focus();
            return false;
          } catch ( e ) {
            // Support: IE<9
            // If we error on focus to hidden element (#1486, #12518),
            // let .trigger() run the handlers
          }
        }
      },
      delegateType: "focusin"
    },
    blur: {
      trigger: function() {
        if ( this === document.activeElement && this.blur ) {
          this.blur();
          return false;
        }
      },
      delegateType: "focusout"
    },

    beforeunload: {
      postDispatch: function( event ) {

        // Even when returnValue equals to undefined Firefox will still show alert
        if ( event.result !== undefined ) {
          event.originalEvent.returnValue = event.result;
        }
      }
    }
  },

  simulate: function( type, elem, event, bubble ) {
    // Piggyback on a donor event to simulate a different one.
    // Fake originalEvent to avoid donor's stopPropagation, but if the
    // simulated event prevents default then we do the same on the donor.
    var e = jQuery.extend(
      new jQuery.Event(),
      event,
      { type: type,
        isSimulated: true,
        originalEvent: {}
      }
    );
    if ( bubble ) {
      jQuery.event.trigger( e, null, elem );
    } else {
      jQuery.event.dispatch.call( elem, e );
    }
    if ( e.isDefaultPrevented() ) {
      event.preventDefault();
    }
  }
};

jQuery.removeEvent = document.removeEventListener ?
  function( elem, type, handle ) {
    if ( elem.removeEventListener ) {
      elem.removeEventListener( type, handle, false );
    }
  } :
  function( elem, type, handle ) {
    var name = "on" + type;

    if ( elem.detachEvent ) {

      // #8545, #7054, preventing memory leaks for custom events in IE6-8
      // detachEvent needed property on element, by name of that event, to properly expose it to GC
      if ( typeof elem[ name ] === core_strundefined ) {
        elem[ name ] = null;
      }

      elem.detachEvent( name, handle );
    }
  };

jQuery.Event = function( src, props ) {
  // Allow instantiation without the 'new' keyword
  if ( !(this instanceof jQuery.Event) ) {
    return new jQuery.Event( src, props );
  }

  // Event object
  if ( src && src.type ) {
    this.originalEvent = src;
    this.type = src.type;

    // Events bubbling up the document may have been marked as prevented
    // by a handler lower down the tree; reflect the correct value.
    this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
      src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

  // Event type
  } else {
    this.type = src;
  }

  // Put explicitly provided properties onto the event object
  if ( props ) {
    jQuery.extend( this, props );
  }

  // Create a timestamp if incoming event doesn't have one
  this.timeStamp = src && src.timeStamp || jQuery.now();

  // Mark it as fixed
  this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
  isDefaultPrevented: returnFalse,
  isPropagationStopped: returnFalse,
  isImmediatePropagationStopped: returnFalse,

  preventDefault: function() {
    var e = this.originalEvent;

    this.isDefaultPrevented = returnTrue;
    if ( !e ) {
      return;
    }

    // If preventDefault exists, run it on the original event
    if ( e.preventDefault ) {
      e.preventDefault();

    // Support: IE
    // Otherwise set the returnValue property of the original event to false
    } else {
      e.returnValue = false;
    }
  },
  stopPropagation: function() {
    var e = this.originalEvent;

    this.isPropagationStopped = returnTrue;
    if ( !e ) {
      return;
    }
    // If stopPropagation exists, run it on the original event
    if ( e.stopPropagation ) {
      e.stopPropagation();
    }

    // Support: IE
    // Set the cancelBubble property of the original event to true
    e.cancelBubble = true;
  },
  stopImmediatePropagation: function() {
    this.isImmediatePropagationStopped = returnTrue;
    this.stopPropagation();
  }
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
}, function( orig, fix ) {
  jQuery.event.special[ orig ] = {
    delegateType: fix,
    bindType: fix,

    handle: function( event ) {
      var ret,
        target = this,
        related = event.relatedTarget,
        handleObj = event.handleObj;

      // For mousenter/leave call the handler if related is outside the target.
      // NB: No relatedTarget if the mouse left/entered the browser window
      if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
        event.type = handleObj.origType;
        ret = handleObj.handler.apply( this, arguments );
        event.type = fix;
      }
      return ret;
    }
  };
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

  jQuery.event.special.submit = {
    setup: function() {
      // Only need this for delegated form submit events
      if ( jQuery.nodeName( this, "form" ) ) {
        return false;
      }

      // Lazy-add a submit handler when a descendant form may potentially be submitted
      jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
        // Node name check avoids a VML-related crash in IE (#9807)
        var elem = e.target,
          form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
        if ( form && !jQuery._data( form, "submitBubbles" ) ) {
          jQuery.event.add( form, "submit._submit", function( event ) {
            event._submit_bubble = true;
          });
          jQuery._data( form, "submitBubbles", true );
        }
      });
      // return undefined since we don't need an event listener
    },

    postDispatch: function( event ) {
      // If form was submitted by the user, bubble the event up the tree
      if ( event._submit_bubble ) {
        delete event._submit_bubble;
        if ( this.parentNode && !event.isTrigger ) {
          jQuery.event.simulate( "submit", this.parentNode, event, true );
        }
      }
    },

    teardown: function() {
      // Only need this for delegated form submit events
      if ( jQuery.nodeName( this, "form" ) ) {
        return false;
      }

      // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
      jQuery.event.remove( this, "._submit" );
    }
  };
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

  jQuery.event.special.change = {

    setup: function() {

      if ( rformElems.test( this.nodeName ) ) {
        // IE doesn't fire change on a check/radio until blur; trigger it on click
        // after a propertychange. Eat the blur-change in special.change.handle.
        // This still fires onchange a second time for check/radio after blur.
        if ( this.type === "checkbox" || this.type === "radio" ) {
          jQuery.event.add( this, "propertychange._change", function( event ) {
            if ( event.originalEvent.propertyName === "checked" ) {
              this._just_changed = true;
            }
          });
          jQuery.event.add( this, "click._change", function( event ) {
            if ( this._just_changed && !event.isTrigger ) {
              this._just_changed = false;
            }
            // Allow triggered, simulated change events (#11500)
            jQuery.event.simulate( "change", this, event, true );
          });
        }
        return false;
      }
      // Delegated event; lazy-add a change handler on descendant inputs
      jQuery.event.add( this, "beforeactivate._change", function( e ) {
        var elem = e.target;

        if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
          jQuery.event.add( elem, "change._change", function( event ) {
            if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
              jQuery.event.simulate( "change", this.parentNode, event, true );
            }
          });
          jQuery._data( elem, "changeBubbles", true );
        }
      });
    },

    handle: function( event ) {
      var elem = event.target;

      // Swallow native change events from checkbox/radio, we already triggered them above
      if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
        return event.handleObj.handler.apply( this, arguments );
      }
    },

    teardown: function() {
      jQuery.event.remove( this, "._change" );

      return !rformElems.test( this.nodeName );
    }
  };
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
  jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

    // Attach a single capturing handler while someone wants focusin/focusout
    var attaches = 0,
      handler = function( event ) {
        jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
      };

    jQuery.event.special[ fix ] = {
      setup: function() {
        if ( attaches++ === 0 ) {
          document.addEventListener( orig, handler, true );
        }
      },
      teardown: function() {
        if ( --attaches === 0 ) {
          document.removeEventListener( orig, handler, true );
        }
      }
    };
  });
}

jQuery.fn.extend({

  on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
    var type, origFn;

    // Types can be a map of types/handlers
    if ( typeof types === "object" ) {
      // ( types-Object, selector, data )
      if ( typeof selector !== "string" ) {
        // ( types-Object, data )
        data = data || selector;
        selector = undefined;
      }
      for ( type in types ) {
        this.on( type, selector, data, types[ type ], one );
      }
      return this;
    }

    if ( data == null && fn == null ) {
      // ( types, fn )
      fn = selector;
      data = selector = undefined;
    } else if ( fn == null ) {
      if ( typeof selector === "string" ) {
        // ( types, selector, fn )
        fn = data;
        data = undefined;
      } else {
        // ( types, data, fn )
        fn = data;
        data = selector;
        selector = undefined;
      }
    }
    if ( fn === false ) {
      fn = returnFalse;
    } else if ( !fn ) {
      return this;
    }

    if ( one === 1 ) {
      origFn = fn;
      fn = function( event ) {
        // Can use an empty set, since event contains the info
        jQuery().off( event );
        return origFn.apply( this, arguments );
      };
      // Use same guid so caller can remove using origFn
      fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    }
    return this.each( function() {
      jQuery.event.add( this, types, fn, data, selector );
    });
  },
  one: function( types, selector, data, fn ) {
    return this.on( types, selector, data, fn, 1 );
  },
  off: function( types, selector, fn ) {
    var handleObj, type;
    if ( types && types.preventDefault && types.handleObj ) {
      // ( event )  dispatched jQuery.Event
      handleObj = types.handleObj;
      jQuery( types.delegateTarget ).off(
        handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
        handleObj.selector,
        handleObj.handler
      );
      return this;
    }
    if ( typeof types === "object" ) {
      // ( types-object [, selector] )
      for ( type in types ) {
        this.off( type, selector, types[ type ] );
      }
      return this;
    }
    if ( selector === false || typeof selector === "function" ) {
      // ( types [, fn] )
      fn = selector;
      selector = undefined;
    }
    if ( fn === false ) {
      fn = returnFalse;
    }
    return this.each(function() {
      jQuery.event.remove( this, types, fn, selector );
    });
  },

  bind: function( types, data, fn ) {
    return this.on( types, null, data, fn );
  },
  unbind: function( types, fn ) {
    return this.off( types, null, fn );
  },

  delegate: function( selector, types, data, fn ) {
    return this.on( types, selector, data, fn );
  },
  undelegate: function( selector, types, fn ) {
    // ( namespace ) or ( selector, types [, fn] )
    return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
  },

  trigger: function( type, data ) {
    return this.each(function() {
      jQuery.event.trigger( type, data, this );
    });
  },
  triggerHandler: function( type, data ) {
    var elem = this[0];
    if ( elem ) {
      return jQuery.event.trigger( type, data, elem, true );
    }
  }
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
  cachedruns,
  Expr,
  getText,
  isXML,
  compile,
  hasDuplicate,
  outermostContext,

  // Local document vars
  setDocument,
  document,
  docElem,
  documentIsXML,
  rbuggyQSA,
  rbuggyMatches,
  matches,
  contains,
  sortOrder,

  // Instance-specific data
  expando = "sizzle" + -(new Date()),
  preferredDoc = window.document,
  support = {},
  dirruns = 0,
  done = 0,
  classCache = createCache(),
  tokenCache = createCache(),
  compilerCache = createCache(),

  // General-purpose constants
  strundefined = typeof undefined,
  MAX_NEGATIVE = 1 << 31,

  // Array methods
  arr = [],
  pop = arr.pop,
  push = arr.push,
  slice = arr.slice,
  // Use a stripped-down indexOf if we can't use a native one
  indexOf = arr.indexOf || function( elem ) {
    var i = 0,
      len = this.length;
    for ( ; i < len; i++ ) {
      if ( this[i] === elem ) {
        return i;
      }
    }
    return -1;
  },


  // Regular expressions

  // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
  whitespace = "[\\x20\\t\\r\\n\\f]",
  // http://www.w3.org/TR/css3-syntax/#characters
  characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

  // Loosely modeled on CSS identifier characters
  // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
  // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  identifier = characterEncoding.replace( "w", "w#" ),

  // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
  operators = "([*^$|!~]?=)",
  attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
    "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

  // Prefer arguments quoted,
  //   then not containing pseudos/brackets,
  //   then attribute selectors/non-parenthetical expressions,
  //   then anything else
  // These preferences are here to reduce the number of selectors
  //   needing tokenize in the PSEUDO preFilter
  pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

  // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
  rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

  rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
  rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
  rpseudo = new RegExp( pseudos ),
  ridentifier = new RegExp( "^" + identifier + "$" ),

  matchExpr = {
    "ID": new RegExp( "^#(" + characterEncoding + ")" ),
    "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
    "NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
    "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
    "ATTR": new RegExp( "^" + attributes ),
    "PSEUDO": new RegExp( "^" + pseudos ),
    "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
      "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
      "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
    // For use in libraries implementing .is()
    // We use this for POS matching in `select`
    "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
      whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
  },

  rsibling = /[\x20\t\r\n\f]*[+~]/,

  rnative = /^[^{]+\{\s*\[native code/,

  // Easily-parseable/retrievable ID or TAG or CLASS selectors
  rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

  rinputs = /^(?:input|select|textarea|button)$/i,
  rheader = /^h\d$/i,

  rescape = /'|\\/g,
  rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

  // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
  runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
  funescape = function( _, escaped ) {
    var high = "0x" + escaped - 0x10000;
    // NaN means non-codepoint
    return high !== high ?
      escaped :
      // BMP codepoint
      high < 0 ?
        String.fromCharCode( high + 0x10000 ) :
        // Supplemental Plane codepoint (surrogate pair)
        String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
  };

// Use a stripped-down slice if we can't use a native one
try {
  slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
  slice = function( i ) {
    var elem,
      results = [];
    while ( (elem = this[i++]) ) {
      results.push( elem );
    }
    return results;
  };
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
  return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *  property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *  deleting the oldest entry
 */
function createCache() {
  var cache,
    keys = [];

  return (cache = function( key, value ) {
    // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
    if ( keys.push( key += " " ) > Expr.cacheLength ) {
      // Only keep the most recent entries
      delete cache[ keys.shift() ];
    }
    return (cache[ key ] = value);
  });
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
  fn[ expando ] = true;
  return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
  var div = document.createElement("div");

  try {
    return fn( div );
  } catch (e) {
    return false;
  } finally {
    // release memory in IE
    div = null;
  }
}

function Sizzle( selector, context, results, seed ) {
  var match, elem, m, nodeType,
    // QSA vars
    i, groups, old, nid, newContext, newSelector;

  if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
    setDocument( context );
  }

  context = context || document;
  results = results || [];

  if ( !selector || typeof selector !== "string" ) {
    return results;
  }

  if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
    return [];
  }

  if ( !documentIsXML && !seed ) {

    // Shortcuts
    if ( (match = rquickExpr.exec( selector )) ) {
      // Speed-up: Sizzle("#ID")
      if ( (m = match[1]) ) {
        if ( nodeType === 9 ) {
          elem = context.getElementById( m );
          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE, Opera, and Webkit return items
            // by name instead of ID
            if ( elem.id === m ) {
              results.push( elem );
              return results;
            }
          } else {
            return results;
          }
        } else {
          // Context is not a document
          if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
            contains( context, elem ) && elem.id === m ) {
            results.push( elem );
            return results;
          }
        }

      // Speed-up: Sizzle("TAG")
      } else if ( match[2] ) {
        push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
        return results;

      // Speed-up: Sizzle(".CLASS")
      } else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
        push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
        return results;
      }
    }

    // QSA path
    if ( support.qsa && !rbuggyQSA.test(selector) ) {
      old = true;
      nid = expando;
      newContext = context;
      newSelector = nodeType === 9 && selector;

      // qSA works strangely on Element-rooted queries
      // We can work around this by specifying an extra ID on the root
      // and working up from there (Thanks to Andrew Dupont for the technique)
      // IE 8 doesn't work on object elements
      if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
        groups = tokenize( selector );

        if ( (old = context.getAttribute("id")) ) {
          nid = old.replace( rescape, "\\$&" );
        } else {
          context.setAttribute( "id", nid );
        }
        nid = "[id='" + nid + "'] ";

        i = groups.length;
        while ( i-- ) {
          groups[i] = nid + toSelector( groups[i] );
        }
        newContext = rsibling.test( selector ) && context.parentNode || context;
        newSelector = groups.join(",");
      }

      if ( newSelector ) {
        try {
          push.apply( results, slice.call( newContext.querySelectorAll(
            newSelector
          ), 0 ) );
          return results;
        } catch(qsaError) {
        } finally {
          if ( !old ) {
            context.removeAttribute("id");
          }
        }
      }
    }
  }

  // All others
  return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
  // documentElement is verified for cases where it doesn't yet exist
  // (such as loading iframes in IE - #4833)
  var documentElement = elem && (elem.ownerDocument || elem).documentElement;
  return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
  var doc = node ? node.ownerDocument || node : preferredDoc;

  // If no document and documentElement is available, return
  if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
    return document;
  }

  // Set our document
  document = doc;
  docElem = doc.documentElement;

  // Support tests
  documentIsXML = isXML( doc );

  // Check if getElementsByTagName("*") returns only elements
  support.tagNameNoComments = assert(function( div ) {
    div.appendChild( doc.createComment("") );
    return !div.getElementsByTagName("*").length;
  });

  // Check if attributes should be retrieved by attribute nodes
  support.attributes = assert(function( div ) {
    div.innerHTML = "<select></select>";
    var type = typeof div.lastChild.getAttribute("multiple");
    // IE8 returns a string for some attributes even when not present
    return type !== "boolean" && type !== "string";
  });

  // Check if getElementsByClassName can be trusted
  support.getByClassName = assert(function( div ) {
    // Opera can't find a second classname (in 9.6)
    div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
    if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
      return false;
    }

    // Safari 3.2 caches class attributes and doesn't catch changes
    div.lastChild.className = "e";
    return div.getElementsByClassName("e").length === 2;
  });

  // Check if getElementById returns elements by name
  // Check if getElementsByName privileges form controls or returns elements by ID
  support.getByName = assert(function( div ) {
    // Inject content
    div.id = expando + 0;
    div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
    docElem.insertBefore( div, docElem.firstChild );

    // Test
    var pass = doc.getElementsByName &&
      // buggy browsers will return fewer than the correct 2
      doc.getElementsByName( expando ).length === 2 +
      // buggy browsers will return more than the correct 0
      doc.getElementsByName( expando + 0 ).length;
    support.getIdNotName = !doc.getElementById( expando );

    // Cleanup
    docElem.removeChild( div );

    return pass;
  });

  // IE6/7 return modified attributes
  Expr.attrHandle = assert(function( div ) {
    div.innerHTML = "<a href='#'></a>";
    return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
      div.firstChild.getAttribute("href") === "#";
  }) ?
    {} :
    {
      "href": function( elem ) {
        return elem.getAttribute( "href", 2 );
      },
      "type": function( elem ) {
        return elem.getAttribute("type");
      }
    };

  // ID find and filter
  if ( support.getIdNotName ) {
    Expr.find["ID"] = function( id, context ) {
      if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
        var m = context.getElementById( id );
        // Check parentNode to catch when Blackberry 4.6 returns
        // nodes that are no longer in the document #6963
        return m && m.parentNode ? [m] : [];
      }
    };
    Expr.filter["ID"] = function( id ) {
      var attrId = id.replace( runescape, funescape );
      return function( elem ) {
        return elem.getAttribute("id") === attrId;
      };
    };
  } else {
    Expr.find["ID"] = function( id, context ) {
      if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
        var m = context.getElementById( id );

        return m ?
          m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
            [m] :
            undefined :
          [];
      }
    };
    Expr.filter["ID"] =  function( id ) {
      var attrId = id.replace( runescape, funescape );
      return function( elem ) {
        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
        return node && node.value === attrId;
      };
    };
  }

  // Tag
  Expr.find["TAG"] = support.tagNameNoComments ?
    function( tag, context ) {
      if ( typeof context.getElementsByTagName !== strundefined ) {
        return context.getElementsByTagName( tag );
      }
    } :
    function( tag, context ) {
      var elem,
        tmp = [],
        i = 0,
        results = context.getElementsByTagName( tag );

      // Filter out possible comments
      if ( tag === "*" ) {
        while ( (elem = results[i++]) ) {
          if ( elem.nodeType === 1 ) {
            tmp.push( elem );
          }
        }

        return tmp;
      }
      return results;
    };

  // Name
  Expr.find["NAME"] = support.getByName && function( tag, context ) {
    if ( typeof context.getElementsByName !== strundefined ) {
      return context.getElementsByName( name );
    }
  };

  // Class
  Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
    if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
      return context.getElementsByClassName( className );
    }
  };

  // QSA and matchesSelector support

  // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
  rbuggyMatches = [];

  // qSa(:focus) reports false when true (Chrome 21),
  // no need to also add to buggyMatches since matches checks buggyQSA
  // A support test would require too much code (would include document ready)
  rbuggyQSA = [ ":focus" ];

  if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
    // Build QSA regex
    // Regex strategy adopted from Diego Perini
    assert(function( div ) {
      // Select is set to empty string on purpose
      // This is to test IE's treatment of not explictly
      // setting a boolean content attribute,
      // since its presence should be enough
      // http://bugs.jquery.com/ticket/12359
      div.innerHTML = "<select><option selected=''></option></select>";

      // IE8 - Some boolean attributes are not treated correctly
      if ( !div.querySelectorAll("[selected]").length ) {
        rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
      }

      // Webkit/Opera - :checked should return selected option elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      // IE8 throws error here and will not see later tests
      if ( !div.querySelectorAll(":checked").length ) {
        rbuggyQSA.push(":checked");
      }
    });

    assert(function( div ) {

      // Opera 10-12/IE8 - ^= $= *= and empty values
      // Should not select anything
      div.innerHTML = "<input type='hidden' i=''/>";
      if ( div.querySelectorAll("[i^='']").length ) {
        rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
      }

      // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
      // IE8 throws error here and will not see later tests
      if ( !div.querySelectorAll(":enabled").length ) {
        rbuggyQSA.push( ":enabled", ":disabled" );
      }

      // Opera 10-11 does not throw on post-comma invalid pseudos
      div.querySelectorAll("*,:x");
      rbuggyQSA.push(",.*:");
    });
  }

  if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
    docElem.mozMatchesSelector ||
    docElem.webkitMatchesSelector ||
    docElem.oMatchesSelector ||
    docElem.msMatchesSelector) )) ) {

    assert(function( div ) {
      // Check to see if it's possible to do matchesSelector
      // on a disconnected node (IE 9)
      support.disconnectedMatch = matches.call( div, "div" );

      // This should fail with an exception
      // Gecko does not error, returns false instead
      matches.call( div, "[s!='']:x" );
      rbuggyMatches.push( "!=", pseudos );
    });
  }

  rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
  rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

  // Element contains another
  // Purposefully does not implement inclusive descendent
  // As in, an element does not contain itself
  contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
    function( a, b ) {
      var adown = a.nodeType === 9 ? a.documentElement : a,
        bup = b && b.parentNode;
      return a === bup || !!( bup && bup.nodeType === 1 && (
        adown.contains ?
          adown.contains( bup ) :
          a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
      ));
    } :
    function( a, b ) {
      if ( b ) {
        while ( (b = b.parentNode) ) {
          if ( b === a ) {
            return true;
          }
        }
      }
      return false;
    };

  // Document order sorting
  sortOrder = docElem.compareDocumentPosition ?
  function( a, b ) {
    var compare;

    if ( a === b ) {
      hasDuplicate = true;
      return 0;
    }

    if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
      if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
        if ( a === doc || contains( preferredDoc, a ) ) {
          return -1;
        }
        if ( b === doc || contains( preferredDoc, b ) ) {
          return 1;
        }
        return 0;
      }
      return compare & 4 ? -1 : 1;
    }

    return a.compareDocumentPosition ? -1 : 1;
  } :
  function( a, b ) {
    var cur,
      i = 0,
      aup = a.parentNode,
      bup = b.parentNode,
      ap = [ a ],
      bp = [ b ];

    // Exit early if the nodes are identical
    if ( a === b ) {
      hasDuplicate = true;
      return 0;

    // Parentless nodes are either documents or disconnected
    } else if ( !aup || !bup ) {
      return a === doc ? -1 :
        b === doc ? 1 :
        aup ? -1 :
        bup ? 1 :
        0;

    // If the nodes are siblings, we can do a quick check
    } else if ( aup === bup ) {
      return siblingCheck( a, b );
    }

    // Otherwise we need full lists of their ancestors for comparison
    cur = a;
    while ( (cur = cur.parentNode) ) {
      ap.unshift( cur );
    }
    cur = b;
    while ( (cur = cur.parentNode) ) {
      bp.unshift( cur );
    }

    // Walk down the tree looking for a discrepancy
    while ( ap[i] === bp[i] ) {
      i++;
    }

    return i ?
      // Do a sibling check if the nodes have a common ancestor
      siblingCheck( ap[i], bp[i] ) :

      // Otherwise nodes in our document sort first
      ap[i] === preferredDoc ? -1 :
      bp[i] === preferredDoc ? 1 :
      0;
  };

  // Always assume the presence of duplicates if sort doesn't
  // pass them to our comparison function (as in Google Chrome).
  hasDuplicate = false;
  [0, 0].sort( sortOrder );
  support.detectDuplicates = hasDuplicate;

  return document;
};

Sizzle.matches = function( expr, elements ) {
  return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
  // Set document vars if needed
  if ( ( elem.ownerDocument || elem ) !== document ) {
    setDocument( elem );
  }

  // Make sure that attribute selectors are quoted
  expr = expr.replace( rattributeQuotes, "='$1']" );

  // rbuggyQSA always contains :focus, so no need for an existence check
  if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
    try {
      var ret = matches.call( elem, expr );

      // IE 9's matchesSelector returns false on disconnected nodes
      if ( ret || support.disconnectedMatch ||
          // As well, disconnected nodes are said to be in a document
          // fragment in IE 9
          elem.document && elem.document.nodeType !== 11 ) {
        return ret;
      }
    } catch(e) {}
  }

  return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
  // Set document vars if needed
  if ( ( context.ownerDocument || context ) !== document ) {
    setDocument( context );
  }
  return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
  var val;

  // Set document vars if needed
  if ( ( elem.ownerDocument || elem ) !== document ) {
    setDocument( elem );
  }

  if ( !documentIsXML ) {
    name = name.toLowerCase();
  }
  if ( (val = Expr.attrHandle[ name ]) ) {
    return val( elem );
  }
  if ( documentIsXML || support.attributes ) {
    return elem.getAttribute( name );
  }
  return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
    name :
    val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
  throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
  var elem,
    duplicates = [],
    i = 1,
    j = 0;

  // Unless we *know* we can detect duplicates, assume their presence
  hasDuplicate = !support.detectDuplicates;
  results.sort( sortOrder );

  if ( hasDuplicate ) {
    for ( ; (elem = results[i]); i++ ) {
      if ( elem === results[ i - 1 ] ) {
        j = duplicates.push( i );
      }
    }
    while ( j-- ) {
      results.splice( duplicates[ j ], 1 );
    }
  }

  return results;
};

function siblingCheck( a, b ) {
  var cur = b && a,
    diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

  // Use IE sourceIndex if available on both nodes
  if ( diff ) {
    return diff;
  }

  // Check if b follows a
  if ( cur ) {
    while ( (cur = cur.nextSibling) ) {
      if ( cur === b ) {
        return -1;
      }
    }
  }

  return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
  return function( elem ) {
    var name = elem.nodeName.toLowerCase();
    return name === "input" && elem.type === type;
  };
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
  return function( elem ) {
    var name = elem.nodeName.toLowerCase();
    return (name === "input" || name === "button") && elem.type === type;
  };
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
  return markFunction(function( argument ) {
    argument = +argument;
    return markFunction(function( seed, matches ) {
      var j,
        matchIndexes = fn( [], seed.length, argument ),
        i = matchIndexes.length;

      // Match elements found at the specified indexes
      while ( i-- ) {
        if ( seed[ (j = matchIndexes[i]) ] ) {
          seed[j] = !(matches[j] = seed[j]);
        }
      }
    });
  });
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
  var node,
    ret = "",
    i = 0,
    nodeType = elem.nodeType;

  if ( !nodeType ) {
    // If no nodeType, this is expected to be an array
    for ( ; (node = elem[i]); i++ ) {
      // Do not traverse comment nodes
      ret += getText( node );
    }
  } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
    // Use textContent for elements
    // innerText usage removed for consistency of new lines (see #11153)
    if ( typeof elem.textContent === "string" ) {
      return elem.textContent;
    } else {
      // Traverse its children
      for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
        ret += getText( elem );
      }
    }
  } else if ( nodeType === 3 || nodeType === 4 ) {
    return elem.nodeValue;
  }
  // Do not include comment or processing instruction nodes

  return ret;
};

Expr = Sizzle.selectors = {

  // Can be adjusted by the user
  cacheLength: 50,

  createPseudo: markFunction,

  match: matchExpr,

  find: {},

  relative: {
    ">": { dir: "parentNode", first: true },
    " ": { dir: "parentNode" },
    "+": { dir: "previousSibling", first: true },
    "~": { dir: "previousSibling" }
  },

  preFilter: {
    "ATTR": function( match ) {
      match[1] = match[1].replace( runescape, funescape );

      // Move the given value to match[3] whether quoted or unquoted
      match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

      if ( match[2] === "~=" ) {
        match[3] = " " + match[3] + " ";
      }

      return match.slice( 0, 4 );
    },

    "CHILD": function( match ) {
      /* matches from matchExpr["CHILD"]
        1 type (only|nth|...)
        2 what (child|of-type)
        3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
        4 xn-component of xn+y argument ([+-]?\d*n|)
        5 sign of xn-component
        6 x of xn-component
        7 sign of y-component
        8 y of y-component
      */
      match[1] = match[1].toLowerCase();

      if ( match[1].slice( 0, 3 ) === "nth" ) {
        // nth-* requires argument
        if ( !match[3] ) {
          Sizzle.error( match[0] );
        }

        // numeric x and y parameters for Expr.filter.CHILD
        // remember that false/true cast respectively to 0/1
        match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
        match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

      // other types prohibit arguments
      } else if ( match[3] ) {
        Sizzle.error( match[0] );
      }

      return match;
    },

    "PSEUDO": function( match ) {
      var excess,
        unquoted = !match[5] && match[2];

      if ( matchExpr["CHILD"].test( match[0] ) ) {
        return null;
      }

      // Accept quoted arguments as-is
      if ( match[4] ) {
        match[2] = match[4];

      // Strip excess characters from unquoted arguments
      } else if ( unquoted && rpseudo.test( unquoted ) &&
        // Get excess from tokenize (recursively)
        (excess = tokenize( unquoted, true )) &&
        // advance to the next closing parenthesis
        (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

        // excess is a negative index
        match[0] = match[0].slice( 0, excess );
        match[2] = unquoted.slice( 0, excess );
      }

      // Return only captures needed by the pseudo filter method (type and argument)
      return match.slice( 0, 3 );
    }
  },

  filter: {

    "TAG": function( nodeName ) {
      if ( nodeName === "*" ) {
        return function() { return true; };
      }

      nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
      return function( elem ) {
        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
      };
    },

    "CLASS": function( className ) {
      var pattern = classCache[ className + " " ];

      return pattern ||
        (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
        classCache( className, function( elem ) {
          return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
        });
    },

    "ATTR": function( name, operator, check ) {
      return function( elem ) {
        var result = Sizzle.attr( elem, name );

        if ( result == null ) {
          return operator === "!=";
        }
        if ( !operator ) {
          return true;
        }

        result += "";

        return operator === "=" ? result === check :
          operator === "!=" ? result !== check :
          operator === "^=" ? check && result.indexOf( check ) === 0 :
          operator === "*=" ? check && result.indexOf( check ) > -1 :
          operator === "$=" ? check && result.slice( -check.length ) === check :
          operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
          operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
          false;
      };
    },

    "CHILD": function( type, what, argument, first, last ) {
      var simple = type.slice( 0, 3 ) !== "nth",
        forward = type.slice( -4 ) !== "last",
        ofType = what === "of-type";

      return first === 1 && last === 0 ?

        // Shortcut for :nth-*(n)
        function( elem ) {
          return !!elem.parentNode;
        } :

        function( elem, context, xml ) {
          var cache, outerCache, node, diff, nodeIndex, start,
            dir = simple !== forward ? "nextSibling" : "previousSibling",
            parent = elem.parentNode,
            name = ofType && elem.nodeName.toLowerCase(),
            useCache = !xml && !ofType;

          if ( parent ) {

            // :(first|last|only)-(child|of-type)
            if ( simple ) {
              while ( dir ) {
                node = elem;
                while ( (node = node[ dir ]) ) {
                  if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                    return false;
                  }
                }
                // Reverse direction for :only-* (if we haven't yet done so)
                start = dir = type === "only" && !start && "nextSibling";
              }
              return true;
            }

            start = [ forward ? parent.firstChild : parent.lastChild ];

            // non-xml :nth-child(...) stores cache data on `parent`
            if ( forward && useCache ) {
              // Seek `elem` from a previously-cached index
              outerCache = parent[ expando ] || (parent[ expando ] = {});
              cache = outerCache[ type ] || [];
              nodeIndex = cache[0] === dirruns && cache[1];
              diff = cache[0] === dirruns && cache[2];
              node = nodeIndex && parent.childNodes[ nodeIndex ];

              while ( (node = ++nodeIndex && node && node[ dir ] ||

                // Fallback to seeking `elem` from the start
                (diff = nodeIndex = 0) || start.pop()) ) {

                // When found, cache indexes on `parent` and break
                if ( node.nodeType === 1 && ++diff && node === elem ) {
                  outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                  break;
                }
              }

            // Use previously-cached element index if available
            } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
              diff = cache[1];

            // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
            } else {
              // Use the same loop as above to seek `elem` from the start
              while ( (node = ++nodeIndex && node && node[ dir ] ||
                (diff = nodeIndex = 0) || start.pop()) ) {

                if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                  // Cache the index of each encountered element
                  if ( useCache ) {
                    (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                  }

                  if ( node === elem ) {
                    break;
                  }
                }
              }
            }

            // Incorporate the offset, then check against cycle size
            diff -= last;
            return diff === first || ( diff % first === 0 && diff / first >= 0 );
          }
        };
    },

    "PSEUDO": function( pseudo, argument ) {
      // pseudo-class names are case-insensitive
      // http://www.w3.org/TR/selectors/#pseudo-classes
      // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
      // Remember that setFilters inherits from pseudos
      var args,
        fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
          Sizzle.error( "unsupported pseudo: " + pseudo );

      // The user may use createPseudo to indicate that
      // arguments are needed to create the filter function
      // just as Sizzle does
      if ( fn[ expando ] ) {
        return fn( argument );
      }

      // But maintain support for old signatures
      if ( fn.length > 1 ) {
        args = [ pseudo, pseudo, "", argument ];
        return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
          markFunction(function( seed, matches ) {
            var idx,
              matched = fn( seed, argument ),
              i = matched.length;
            while ( i-- ) {
              idx = indexOf.call( seed, matched[i] );
              seed[ idx ] = !( matches[ idx ] = matched[i] );
            }
          }) :
          function( elem ) {
            return fn( elem, 0, args );
          };
      }

      return fn;
    }
  },

  pseudos: {
    // Potentially complex pseudos
    "not": markFunction(function( selector ) {
      // Trim the selector passed to compile
      // to avoid treating leading and trailing
      // spaces as combinators
      var input = [],
        results = [],
        matcher = compile( selector.replace( rtrim, "$1" ) );

      return matcher[ expando ] ?
        markFunction(function( seed, matches, context, xml ) {
          var elem,
            unmatched = matcher( seed, null, xml, [] ),
            i = seed.length;

          // Match elements unmatched by `matcher`
          while ( i-- ) {
            if ( (elem = unmatched[i]) ) {
              seed[i] = !(matches[i] = elem);
            }
          }
        }) :
        function( elem, context, xml ) {
          input[0] = elem;
          matcher( input, null, xml, results );
          return !results.pop();
        };
    }),

    "has": markFunction(function( selector ) {
      return function( elem ) {
        return Sizzle( selector, elem ).length > 0;
      };
    }),

    "contains": markFunction(function( text ) {
      return function( elem ) {
        return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
      };
    }),

    // "Whether an element is represented by a :lang() selector
    // is based solely on the element's language value
    // being equal to the identifier C,
    // or beginning with the identifier C immediately followed by "-".
    // The matching of C against the element's language value is performed case-insensitively.
    // The identifier C does not have to be a valid language name."
    // http://www.w3.org/TR/selectors/#lang-pseudo
    "lang": markFunction( function( lang ) {
      // lang value must be a valid identifider
      if ( !ridentifier.test(lang || "") ) {
        Sizzle.error( "unsupported lang: " + lang );
      }
      lang = lang.replace( runescape, funescape ).toLowerCase();
      return function( elem ) {
        var elemLang;
        do {
          if ( (elemLang = documentIsXML ?
            elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
            elem.lang) ) {

            elemLang = elemLang.toLowerCase();
            return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
          }
        } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
        return false;
      };
    }),

    // Miscellaneous
    "target": function( elem ) {
      var hash = window.location && window.location.hash;
      return hash && hash.slice( 1 ) === elem.id;
    },

    "root": function( elem ) {
      return elem === docElem;
    },

    "focus": function( elem ) {
      return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
    },

    // Boolean properties
    "enabled": function( elem ) {
      return elem.disabled === false;
    },

    "disabled": function( elem ) {
      return elem.disabled === true;
    },

    "checked": function( elem ) {
      // In CSS3, :checked should return both checked and selected elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      var nodeName = elem.nodeName.toLowerCase();
      return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
    },

    "selected": function( elem ) {
      // Accessing this property makes selected-by-default
      // options in Safari work properly
      if ( elem.parentNode ) {
        elem.parentNode.selectedIndex;
      }

      return elem.selected === true;
    },

    // Contents
    "empty": function( elem ) {
      // http://www.w3.org/TR/selectors/#empty-pseudo
      // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
      //   not comment, processing instructions, or others
      // Thanks to Diego Perini for the nodeName shortcut
      //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
      for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
        if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
          return false;
        }
      }
      return true;
    },

    "parent": function( elem ) {
      return !Expr.pseudos["empty"]( elem );
    },

    // Element/input types
    "header": function( elem ) {
      return rheader.test( elem.nodeName );
    },

    "input": function( elem ) {
      return rinputs.test( elem.nodeName );
    },

    "button": function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return name === "input" && elem.type === "button" || name === "button";
    },

    "text": function( elem ) {
      var attr;
      // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
      // use getAttribute instead to test this case
      return elem.nodeName.toLowerCase() === "input" &&
        elem.type === "text" &&
        ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
    },

    // Position-in-collection
    "first": createPositionalPseudo(function() {
      return [ 0 ];
    }),

    "last": createPositionalPseudo(function( matchIndexes, length ) {
      return [ length - 1 ];
    }),

    "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
      return [ argument < 0 ? argument + length : argument ];
    }),

    "even": createPositionalPseudo(function( matchIndexes, length ) {
      var i = 0;
      for ( ; i < length; i += 2 ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "odd": createPositionalPseudo(function( matchIndexes, length ) {
      var i = 1;
      for ( ; i < length; i += 2 ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      var i = argument < 0 ? argument + length : argument;
      for ( ; --i >= 0; ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      var i = argument < 0 ? argument + length : argument;
      for ( ; ++i < length; ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    })
  }
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
  Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
  Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
  var matched, match, tokens, type,
    soFar, groups, preFilters,
    cached = tokenCache[ selector + " " ];

  if ( cached ) {
    return parseOnly ? 0 : cached.slice( 0 );
  }

  soFar = selector;
  groups = [];
  preFilters = Expr.preFilter;

  while ( soFar ) {

    // Comma and first run
    if ( !matched || (match = rcomma.exec( soFar )) ) {
      if ( match ) {
        // Don't consume trailing commas as valid
        soFar = soFar.slice( match[0].length ) || soFar;
      }
      groups.push( tokens = [] );
    }

    matched = false;

    // Combinators
    if ( (match = rcombinators.exec( soFar )) ) {
      matched = match.shift();
      tokens.push( {
        value: matched,
        // Cast descendant combinators to space
        type: match[0].replace( rtrim, " " )
      } );
      soFar = soFar.slice( matched.length );
    }

    // Filters
    for ( type in Expr.filter ) {
      if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
        (match = preFilters[ type ]( match ))) ) {
        matched = match.shift();
        tokens.push( {
          value: matched,
          type: type,
          matches: match
        } );
        soFar = soFar.slice( matched.length );
      }
    }

    if ( !matched ) {
      break;
    }
  }

  // Return the length of the invalid excess
  // if we're just parsing
  // Otherwise, throw an error or return tokens
  return parseOnly ?
    soFar.length :
    soFar ?
      Sizzle.error( selector ) :
      // Cache the tokens
      tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
  var i = 0,
    len = tokens.length,
    selector = "";
  for ( ; i < len; i++ ) {
    selector += tokens[i].value;
  }
  return selector;
}

function addCombinator( matcher, combinator, base ) {
  var dir = combinator.dir,
    checkNonElements = base && dir === "parentNode",
    doneName = done++;

  return combinator.first ?
    // Check against closest ancestor/preceding element
    function( elem, context, xml ) {
      while ( (elem = elem[ dir ]) ) {
        if ( elem.nodeType === 1 || checkNonElements ) {
          return matcher( elem, context, xml );
        }
      }
    } :

    // Check against all ancestor/preceding elements
    function( elem, context, xml ) {
      var data, cache, outerCache,
        dirkey = dirruns + " " + doneName;

      // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
      if ( xml ) {
        while ( (elem = elem[ dir ]) ) {
          if ( elem.nodeType === 1 || checkNonElements ) {
            if ( matcher( elem, context, xml ) ) {
              return true;
            }
          }
        }
      } else {
        while ( (elem = elem[ dir ]) ) {
          if ( elem.nodeType === 1 || checkNonElements ) {
            outerCache = elem[ expando ] || (elem[ expando ] = {});
            if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
              if ( (data = cache[1]) === true || data === cachedruns ) {
                return data === true;
              }
            } else {
              cache = outerCache[ dir ] = [ dirkey ];
              cache[1] = matcher( elem, context, xml ) || cachedruns;
              if ( cache[1] === true ) {
                return true;
              }
            }
          }
        }
      }
    };
}

function elementMatcher( matchers ) {
  return matchers.length > 1 ?
    function( elem, context, xml ) {
      var i = matchers.length;
      while ( i-- ) {
        if ( !matchers[i]( elem, context, xml ) ) {
          return false;
        }
      }
      return true;
    } :
    matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
  var elem,
    newUnmatched = [],
    i = 0,
    len = unmatched.length,
    mapped = map != null;

  for ( ; i < len; i++ ) {
    if ( (elem = unmatched[i]) ) {
      if ( !filter || filter( elem, context, xml ) ) {
        newUnmatched.push( elem );
        if ( mapped ) {
          map.push( i );
        }
      }
    }
  }

  return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
  if ( postFilter && !postFilter[ expando ] ) {
    postFilter = setMatcher( postFilter );
  }
  if ( postFinder && !postFinder[ expando ] ) {
    postFinder = setMatcher( postFinder, postSelector );
  }
  return markFunction(function( seed, results, context, xml ) {
    var temp, i, elem,
      preMap = [],
      postMap = [],
      preexisting = results.length,

      // Get initial elements from seed or context
      elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

      // Prefilter to get matcher input, preserving a map for seed-results synchronization
      matcherIn = preFilter && ( seed || !selector ) ?
        condense( elems, preMap, preFilter, context, xml ) :
        elems,

      matcherOut = matcher ?
        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
        postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

          // ...intermediate processing is necessary
          [] :

          // ...otherwise use results directly
          results :
        matcherIn;

    // Find primary matches
    if ( matcher ) {
      matcher( matcherIn, matcherOut, context, xml );
    }

    // Apply postFilter
    if ( postFilter ) {
      temp = condense( matcherOut, postMap );
      postFilter( temp, [], context, xml );

      // Un-match failing elements by moving them back to matcherIn
      i = temp.length;
      while ( i-- ) {
        if ( (elem = temp[i]) ) {
          matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
        }
      }
    }

    if ( seed ) {
      if ( postFinder || preFilter ) {
        if ( postFinder ) {
          // Get the final matcherOut by condensing this intermediate into postFinder contexts
          temp = [];
          i = matcherOut.length;
          while ( i-- ) {
            if ( (elem = matcherOut[i]) ) {
              // Restore matcherIn since elem is not yet a final match
              temp.push( (matcherIn[i] = elem) );
            }
          }
          postFinder( null, (matcherOut = []), temp, xml );
        }

        // Move matched elements from seed to results to keep them synchronized
        i = matcherOut.length;
        while ( i-- ) {
          if ( (elem = matcherOut[i]) &&
            (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

            seed[temp] = !(results[temp] = elem);
          }
        }
      }

    // Add elements to results, through postFinder if defined
    } else {
      matcherOut = condense(
        matcherOut === results ?
          matcherOut.splice( preexisting, matcherOut.length ) :
          matcherOut
      );
      if ( postFinder ) {
        postFinder( null, results, matcherOut, xml );
      } else {
        push.apply( results, matcherOut );
      }
    }
  });
}

function matcherFromTokens( tokens ) {
  var checkContext, matcher, j,
    len = tokens.length,
    leadingRelative = Expr.relative[ tokens[0].type ],
    implicitRelative = leadingRelative || Expr.relative[" "],
    i = leadingRelative ? 1 : 0,

    // The foundational matcher ensures that elements are reachable from top-level context(s)
    matchContext = addCombinator( function( elem ) {
      return elem === checkContext;
    }, implicitRelative, true ),
    matchAnyContext = addCombinator( function( elem ) {
      return indexOf.call( checkContext, elem ) > -1;
    }, implicitRelative, true ),
    matchers = [ function( elem, context, xml ) {
      return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
        (checkContext = context).nodeType ?
          matchContext( elem, context, xml ) :
          matchAnyContext( elem, context, xml ) );
    } ];

  for ( ; i < len; i++ ) {
    if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
      matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
    } else {
      matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

      // Return special upon seeing a positional matcher
      if ( matcher[ expando ] ) {
        // Find the next relative operator (if any) for proper handling
        j = ++i;
        for ( ; j < len; j++ ) {
          if ( Expr.relative[ tokens[j].type ] ) {
            break;
          }
        }
        return setMatcher(
          i > 1 && elementMatcher( matchers ),
          i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
          matcher,
          i < j && matcherFromTokens( tokens.slice( i, j ) ),
          j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
          j < len && toSelector( tokens )
        );
      }
      matchers.push( matcher );
    }
  }

  return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
  // A counter to specify which element is currently being matched
  var matcherCachedRuns = 0,
    bySet = setMatchers.length > 0,
    byElement = elementMatchers.length > 0,
    superMatcher = function( seed, context, xml, results, expandContext ) {
      var elem, j, matcher,
        setMatched = [],
        matchedCount = 0,
        i = "0",
        unmatched = seed && [],
        outermost = expandContext != null,
        contextBackup = outermostContext,
        // We must always have either seed elements or context
        elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
        // Use integer dirruns iff this is the outermost matcher
        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

      if ( outermost ) {
        outermostContext = context !== document && context;
        cachedruns = matcherCachedRuns;
      }

      // Add elements passing elementMatchers directly to results
      // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
      for ( ; (elem = elems[i]) != null; i++ ) {
        if ( byElement && elem ) {
          j = 0;
          while ( (matcher = elementMatchers[j++]) ) {
            if ( matcher( elem, context, xml ) ) {
              results.push( elem );
              break;
            }
          }
          if ( outermost ) {
            dirruns = dirrunsUnique;
            cachedruns = ++matcherCachedRuns;
          }
        }

        // Track unmatched elements for set filters
        if ( bySet ) {
          // They will have gone through all possible matchers
          if ( (elem = !matcher && elem) ) {
            matchedCount--;
          }

          // Lengthen the array for every element, matched or not
          if ( seed ) {
            unmatched.push( elem );
          }
        }
      }

      // Apply set filters to unmatched elements
      matchedCount += i;
      if ( bySet && i !== matchedCount ) {
        j = 0;
        while ( (matcher = setMatchers[j++]) ) {
          matcher( unmatched, setMatched, context, xml );
        }

        if ( seed ) {
          // Reintegrate element matches to eliminate the need for sorting
          if ( matchedCount > 0 ) {
            while ( i-- ) {
              if ( !(unmatched[i] || setMatched[i]) ) {
                setMatched[i] = pop.call( results );
              }
            }
          }

          // Discard index placeholder values to get only actual matches
          setMatched = condense( setMatched );
        }

        // Add matches to results
        push.apply( results, setMatched );

        // Seedless set matches succeeding multiple successful matchers stipulate sorting
        if ( outermost && !seed && setMatched.length > 0 &&
          ( matchedCount + setMatchers.length ) > 1 ) {

          Sizzle.uniqueSort( results );
        }
      }

      // Override manipulation of globals by nested matchers
      if ( outermost ) {
        dirruns = dirrunsUnique;
        outermostContext = contextBackup;
      }

      return unmatched;
    };

  return bySet ?
    markFunction( superMatcher ) :
    superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
  var i,
    setMatchers = [],
    elementMatchers = [],
    cached = compilerCache[ selector + " " ];

  if ( !cached ) {
    // Generate a function of recursive functions that can be used to check each element
    if ( !group ) {
      group = tokenize( selector );
    }
    i = group.length;
    while ( i-- ) {
      cached = matcherFromTokens( group[i] );
      if ( cached[ expando ] ) {
        setMatchers.push( cached );
      } else {
        elementMatchers.push( cached );
      }
    }

    // Cache the compiled function
    cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
  }
  return cached;
};

function multipleContexts( selector, contexts, results ) {
  var i = 0,
    len = contexts.length;
  for ( ; i < len; i++ ) {
    Sizzle( selector, contexts[i], results );
  }
  return results;
}

function select( selector, context, results, seed ) {
  var i, tokens, token, type, find,
    match = tokenize( selector );

  if ( !seed ) {
    // Try to minimize operations if there is only one group
    if ( match.length === 1 ) {

      // Take a shortcut and set the context if the root selector is an ID
      tokens = match[0] = match[0].slice( 0 );
      if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
          context.nodeType === 9 && !documentIsXML &&
          Expr.relative[ tokens[1].type ] ) {

        context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
        if ( !context ) {
          return results;
        }

        selector = selector.slice( tokens.shift().value.length );
      }

      // Fetch a seed set for right-to-left matching
      i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
      while ( i-- ) {
        token = tokens[i];

        // Abort if we hit a combinator
        if ( Expr.relative[ (type = token.type) ] ) {
          break;
        }
        if ( (find = Expr.find[ type ]) ) {
          // Search, expanding context for leading sibling combinators
          if ( (seed = find(
            token.matches[0].replace( runescape, funescape ),
            rsibling.test( tokens[0].type ) && context.parentNode || context
          )) ) {

            // If seed is empty or no tokens remain, we can return early
            tokens.splice( i, 1 );
            selector = seed.length && toSelector( tokens );
            if ( !selector ) {
              push.apply( results, slice.call( seed, 0 ) );
              return results;
            }

            break;
          }
        }
      }
    }
  }

  // Compile and execute a filtering function
  // Provide `match` to avoid retokenization if we modified the selector above
  compile( selector, match )(
    seed,
    context,
    documentIsXML,
    results,
    rsibling.test( selector )
  );
  return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
  rparentsprev = /^(?:parents|prev(?:Until|All))/,
  isSimple = /^.[^:#\[\.,]*$/,
  rneedsContext = jQuery.expr.match.needsContext,
  // methods guaranteed to produce a unique set when starting from a unique set
  guaranteedUnique = {
    children: true,
    contents: true,
    next: true,
    prev: true
  };

jQuery.fn.extend({
  find: function( selector ) {
    var i, ret, self,
      len = this.length;

    if ( typeof selector !== "string" ) {
      self = this;
      return this.pushStack( jQuery( selector ).filter(function() {
        for ( i = 0; i < len; i++ ) {
          if ( jQuery.contains( self[ i ], this ) ) {
            return true;
          }
        }
      }) );
    }

    ret = [];
    for ( i = 0; i < len; i++ ) {
      jQuery.find( selector, this[ i ], ret );
    }

    // Needed because $( selector, context ) becomes $( context ).find( selector )
    ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
    ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
    return ret;
  },

  has: function( target ) {
    var i,
      targets = jQuery( target, this ),
      len = targets.length;

    return this.filter(function() {
      for ( i = 0; i < len; i++ ) {
        if ( jQuery.contains( this, targets[i] ) ) {
          return true;
        }
      }
    });
  },

  not: function( selector ) {
    return this.pushStack( winnow(this, selector, false) );
  },

  filter: function( selector ) {
    return this.pushStack( winnow(this, selector, true) );
  },

  is: function( selector ) {
    return !!selector && (
      typeof selector === "string" ?
        // If this is a positional/relative selector, check membership in the returned set
        // so $("p:first").is("p:last") won't return true for a doc with two "p".
        rneedsContext.test( selector ) ?
          jQuery( selector, this.context ).index( this[0] ) >= 0 :
          jQuery.filter( selector, this ).length > 0 :
        this.filter( selector ).length > 0 );
  },

  closest: function( selectors, context ) {
    var cur,
      i = 0,
      l = this.length,
      ret = [],
      pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
        jQuery( selectors, context || this.context ) :
        0;

    for ( ; i < l; i++ ) {
      cur = this[i];

      while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
        if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
          ret.push( cur );
          break;
        }
        cur = cur.parentNode;
      }
    }

    return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
  },

  // Determine the position of an element within
  // the matched set of elements
  index: function( elem ) {

    // No argument, return index in parent
    if ( !elem ) {
      return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
    }

    // index in selector
    if ( typeof elem === "string" ) {
      return jQuery.inArray( this[0], jQuery( elem ) );
    }

    // Locate the position of the desired element
    return jQuery.inArray(
      // If it receives a jQuery object, the first element is used
      elem.jquery ? elem[0] : elem, this );
  },

  add: function( selector, context ) {
    var set = typeof selector === "string" ?
        jQuery( selector, context ) :
        jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
      all = jQuery.merge( this.get(), set );

    return this.pushStack( jQuery.unique(all) );
  },

  addBack: function( selector ) {
    return this.add( selector == null ?
      this.prevObject : this.prevObject.filter(selector)
    );
  }
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
  do {
    cur = cur[ dir ];
  } while ( cur && cur.nodeType !== 1 );

  return cur;
}

jQuery.each({
  parent: function( elem ) {
    var parent = elem.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },
  parents: function( elem ) {
    return jQuery.dir( elem, "parentNode" );
  },
  parentsUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "parentNode", until );
  },
  next: function( elem ) {
    return sibling( elem, "nextSibling" );
  },
  prev: function( elem ) {
    return sibling( elem, "previousSibling" );
  },
  nextAll: function( elem ) {
    return jQuery.dir( elem, "nextSibling" );
  },
  prevAll: function( elem ) {
    return jQuery.dir( elem, "previousSibling" );
  },
  nextUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "nextSibling", until );
  },
  prevUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "previousSibling", until );
  },
  siblings: function( elem ) {
    return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
  },
  children: function( elem ) {
    return jQuery.sibling( elem.firstChild );
  },
  contents: function( elem ) {
    return jQuery.nodeName( elem, "iframe" ) ?
      elem.contentDocument || elem.contentWindow.document :
      jQuery.merge( [], elem.childNodes );
  }
}, function( name, fn ) {
  jQuery.fn[ name ] = function( until, selector ) {
    var ret = jQuery.map( this, fn, until );

    if ( !runtil.test( name ) ) {
      selector = until;
    }

    if ( selector && typeof selector === "string" ) {
      ret = jQuery.filter( selector, ret );
    }

    ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

    if ( this.length > 1 && rparentsprev.test( name ) ) {
      ret = ret.reverse();
    }

    return this.pushStack( ret );
  };
});

jQuery.extend({
  filter: function( expr, elems, not ) {
    if ( not ) {
      expr = ":not(" + expr + ")";
    }

    return elems.length === 1 ?
      jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
      jQuery.find.matches(expr, elems);
  },

  dir: function( elem, dir, until ) {
    var matched = [],
      cur = elem[ dir ];

    while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
      if ( cur.nodeType === 1 ) {
        matched.push( cur );
      }
      cur = cur[dir];
    }
    return matched;
  },

  sibling: function( n, elem ) {
    var r = [];

    for ( ; n; n = n.nextSibling ) {
      if ( n.nodeType === 1 && n !== elem ) {
        r.push( n );
      }
    }

    return r;
  }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

  // Can't pass null or undefined to indexOf in Firefox 4
  // Set to 0 to skip string check
  qualifier = qualifier || 0;

  if ( jQuery.isFunction( qualifier ) ) {
    return jQuery.grep(elements, function( elem, i ) {
      var retVal = !!qualifier.call( elem, i, elem );
      return retVal === keep;
    });

  } else if ( qualifier.nodeType ) {
    return jQuery.grep(elements, function( elem ) {
      return ( elem === qualifier ) === keep;
    });

  } else if ( typeof qualifier === "string" ) {
    var filtered = jQuery.grep(elements, function( elem ) {
      return elem.nodeType === 1;
    });

    if ( isSimple.test( qualifier ) ) {
      return jQuery.filter(qualifier, filtered, !keep);
    } else {
      qualifier = jQuery.filter( qualifier, filtered );
    }
  }

  return jQuery.grep(elements, function( elem ) {
    return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
  });
}
function createSafeFragment( document ) {
  var list = nodeNames.split( "|" ),
    safeFrag = document.createDocumentFragment();

  if ( safeFrag.createElement ) {
    while ( list.length ) {
      safeFrag.createElement(
        list.pop()
      );
    }
  }
  return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
    "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
  rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
  rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
  rleadingWhitespace = /^\s+/,
  rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
  rtagName = /<([\w:]+)/,
  rtbody = /<tbody/i,
  rhtml = /<|&#?\w+;/,
  rnoInnerhtml = /<(?:script|style|link)/i,
  manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
  // checked="checked" or checked
  rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
  rscriptType = /^$|\/(?:java|ecma)script/i,
  rscriptTypeMasked = /^true\/(.*)/,
  rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

  // We have to close these tags to support XHTML (#13200)
  wrapMap = {
    option: [ 1, "<select multiple='multiple'>", "</select>" ],
    legend: [ 1, "<fieldset>", "</fieldset>" ],
    area: [ 1, "<map>", "</map>" ],
    param: [ 1, "<object>", "</object>" ],
    thead: [ 1, "<table>", "</table>" ],
    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

    // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
    // unless wrapped in a div with non-breaking characters in front of it.
    _default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
  },
  safeFragment = createSafeFragment( document ),
  fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
  text: function( value ) {
    return jQuery.access( this, function( value ) {
      return value === undefined ?
        jQuery.text( this ) :
        this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
    }, null, value, arguments.length );
  },

  wrapAll: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapAll( html.call(this, i) );
      });
    }

    if ( this[0] ) {
      // The elements to wrap the target around
      var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

      if ( this[0].parentNode ) {
        wrap.insertBefore( this[0] );
      }

      wrap.map(function() {
        var elem = this;

        while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
          elem = elem.firstChild;
        }

        return elem;
      }).append( this );
    }

    return this;
  },

  wrapInner: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapInner( html.call(this, i) );
      });
    }

    return this.each(function() {
      var self = jQuery( this ),
        contents = self.contents();

      if ( contents.length ) {
        contents.wrapAll( html );

      } else {
        self.append( html );
      }
    });
  },

  wrap: function( html ) {
    var isFunction = jQuery.isFunction( html );

    return this.each(function(i) {
      jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
    });
  },

  unwrap: function() {
    return this.parent().each(function() {
      if ( !jQuery.nodeName( this, "body" ) ) {
        jQuery( this ).replaceWith( this.childNodes );
      }
    }).end();
  },

  append: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
        this.appendChild( elem );
      }
    });
  },

  prepend: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
        this.insertBefore( elem, this.firstChild );
      }
    });
  },

  before: function() {
    return this.domManip( arguments, false, function( elem ) {
      if ( this.parentNode ) {
        this.parentNode.insertBefore( elem, this );
      }
    });
  },

  after: function() {
    return this.domManip( arguments, false, function( elem ) {
      if ( this.parentNode ) {
        this.parentNode.insertBefore( elem, this.nextSibling );
      }
    });
  },

  // keepData is for internal use only--do not document
  remove: function( selector, keepData ) {
    var elem,
      i = 0;

    for ( ; (elem = this[i]) != null; i++ ) {
      if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
        if ( !keepData && elem.nodeType === 1 ) {
          jQuery.cleanData( getAll( elem ) );
        }

        if ( elem.parentNode ) {
          if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
            setGlobalEval( getAll( elem, "script" ) );
          }
          elem.parentNode.removeChild( elem );
        }
      }
    }

    return this;
  },

  empty: function() {
    var elem,
      i = 0;

    for ( ; (elem = this[i]) != null; i++ ) {
      // Remove element nodes and prevent memory leaks
      if ( elem.nodeType === 1 ) {
        jQuery.cleanData( getAll( elem, false ) );
      }

      // Remove any remaining nodes
      while ( elem.firstChild ) {
        elem.removeChild( elem.firstChild );
      }

      // If this is a select, ensure that it displays empty (#12336)
      // Support: IE<9
      if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
        elem.options.length = 0;
      }
    }

    return this;
  },

  clone: function( dataAndEvents, deepDataAndEvents ) {
    dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    return this.map( function () {
      return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    });
  },

  html: function( value ) {
    return jQuery.access( this, function( value ) {
      var elem = this[0] || {},
        i = 0,
        l = this.length;

      if ( value === undefined ) {
        return elem.nodeType === 1 ?
          elem.innerHTML.replace( rinlinejQuery, "" ) :
          undefined;
      }

      // See if we can take a shortcut and just use innerHTML
      if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
        ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
        ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
        !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

        value = value.replace( rxhtmlTag, "<$1></$2>" );

        try {
          for (; i < l; i++ ) {
            // Remove element nodes and prevent memory leaks
            elem = this[i] || {};
            if ( elem.nodeType === 1 ) {
              jQuery.cleanData( getAll( elem, false ) );
              elem.innerHTML = value;
            }
          }

          elem = 0;

        // If using innerHTML throws an exception, use the fallback method
        } catch(e) {}
      }

      if ( elem ) {
        this.empty().append( value );
      }
    }, null, value, arguments.length );
  },

  replaceWith: function( value ) {
    var isFunc = jQuery.isFunction( value );

    // Make sure that the elements are removed from the DOM before they are inserted
    // this can help fix replacing a parent with child elements
    if ( !isFunc && typeof value !== "string" ) {
      value = jQuery( value ).not( this ).detach();
    }

    return this.domManip( [ value ], true, function( elem ) {
      var next = this.nextSibling,
        parent = this.parentNode;

      if ( parent ) {
        jQuery( this ).remove();
        parent.insertBefore( elem, next );
      }
    });
  },

  detach: function( selector ) {
    return this.remove( selector, true );
  },

  domManip: function( args, table, callback ) {

    // Flatten any nested arrays
    args = core_concat.apply( [], args );

    var first, node, hasScripts,
      scripts, doc, fragment,
      i = 0,
      l = this.length,
      set = this,
      iNoClone = l - 1,
      value = args[0],
      isFunction = jQuery.isFunction( value );

    // We can't cloneNode fragments that contain checked, in WebKit
    if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
      return this.each(function( index ) {
        var self = set.eq( index );
        if ( isFunction ) {
          args[0] = value.call( this, index, table ? self.html() : undefined );
        }
        self.domManip( args, table, callback );
      });
    }

    if ( l ) {
      fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
      first = fragment.firstChild;

      if ( fragment.childNodes.length === 1 ) {
        fragment = first;
      }

      if ( first ) {
        table = table && jQuery.nodeName( first, "tr" );
        scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
        hasScripts = scripts.length;

        // Use the original fragment for the last item instead of the first because it can end up
        // being emptied incorrectly in certain situations (#8070).
        for ( ; i < l; i++ ) {
          node = fragment;

          if ( i !== iNoClone ) {
            node = jQuery.clone( node, true, true );

            // Keep references to cloned scripts for later restoration
            if ( hasScripts ) {
              jQuery.merge( scripts, getAll( node, "script" ) );
            }
          }

          callback.call(
            table && jQuery.nodeName( this[i], "table" ) ?
              findOrAppend( this[i], "tbody" ) :
              this[i],
            node,
            i
          );
        }

        if ( hasScripts ) {
          doc = scripts[ scripts.length - 1 ].ownerDocument;

          // Reenable scripts
          jQuery.map( scripts, restoreScript );

          // Evaluate executable scripts on first document insertion
          for ( i = 0; i < hasScripts; i++ ) {
            node = scripts[ i ];
            if ( rscriptType.test( node.type || "" ) &&
              !jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

              if ( node.src ) {
                // Hope ajax is available...
                jQuery.ajax({
                  url: node.src,
                  type: "GET",
                  dataType: "script",
                  async: false,
                  global: false,
                  "throws": true
                });
              } else {
                jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
              }
            }
          }
        }

        // Fix #11809: Avoid leaking memory
        fragment = first = null;
      }
    }

    return this;
  }
});

function findOrAppend( elem, tag ) {
  return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
  var attr = elem.getAttributeNode("type");
  elem.type = ( attr && attr.specified ) + "/" + elem.type;
  return elem;
}
function restoreScript( elem ) {
  var match = rscriptTypeMasked.exec( elem.type );
  if ( match ) {
    elem.type = match[1];
  } else {
    elem.removeAttribute("type");
  }
  return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
  var elem,
    i = 0;
  for ( ; (elem = elems[i]) != null; i++ ) {
    jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
  }
}

function cloneCopyEvent( src, dest ) {

  if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
    return;
  }

  var type, i, l,
    oldData = jQuery._data( src ),
    curData = jQuery._data( dest, oldData ),
    events = oldData.events;

  if ( events ) {
    delete curData.handle;
    curData.events = {};

    for ( type in events ) {
      for ( i = 0, l = events[ type ].length; i < l; i++ ) {
        jQuery.event.add( dest, type, events[ type ][ i ] );
      }
    }
  }

  // make the cloned public data object a copy from the original
  if ( curData.data ) {
    curData.data = jQuery.extend( {}, curData.data );
  }
}

function fixCloneNodeIssues( src, dest ) {
  var nodeName, e, data;

  // We do not need to do anything for non-Elements
  if ( dest.nodeType !== 1 ) {
    return;
  }

  nodeName = dest.nodeName.toLowerCase();

  // IE6-8 copies events bound via attachEvent when using cloneNode.
  if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
    data = jQuery._data( dest );

    for ( e in data.events ) {
      jQuery.removeEvent( dest, e, data.handle );
    }

    // Event data gets referenced instead of copied if the expando gets copied too
    dest.removeAttribute( jQuery.expando );
  }

  // IE blanks contents when cloning scripts, and tries to evaluate newly-set text
  if ( nodeName === "script" && dest.text !== src.text ) {
    disableScript( dest ).text = src.text;
    restoreScript( dest );

  // IE6-10 improperly clones children of object elements using classid.
  // IE10 throws NoModificationAllowedError if parent is null, #12132.
  } else if ( nodeName === "object" ) {
    if ( dest.parentNode ) {
      dest.outerHTML = src.outerHTML;
    }

    // This path appears unavoidable for IE9. When cloning an object
    // element in IE9, the outerHTML strategy above is not sufficient.
    // If the src has innerHTML and the destination does not,
    // copy the src.innerHTML into the dest.innerHTML. #10324
    if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
      dest.innerHTML = src.innerHTML;
    }

  } else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
    // IE6-8 fails to persist the checked state of a cloned checkbox
    // or radio button. Worse, IE6-7 fail to give the cloned element
    // a checked appearance if the defaultChecked value isn't also set

    dest.defaultChecked = dest.checked = src.checked;

    // IE6-7 get confused and end up setting the value of a cloned
    // checkbox/radio button to an empty string instead of "on"
    if ( dest.value !== src.value ) {
      dest.value = src.value;
    }

  // IE6-8 fails to return the selected option to the default selected
  // state when cloning options
  } else if ( nodeName === "option" ) {
    dest.defaultSelected = dest.selected = src.defaultSelected;

  // IE6-8 fails to set the defaultValue to the correct value when
  // cloning other types of input fields
  } else if ( nodeName === "input" || nodeName === "textarea" ) {
    dest.defaultValue = src.defaultValue;
  }
}

jQuery.each({
  appendTo: "append",
  prependTo: "prepend",
  insertBefore: "before",
  insertAfter: "after",
  replaceAll: "replaceWith"
}, function( name, original ) {
  jQuery.fn[ name ] = function( selector ) {
    var elems,
      i = 0,
      ret = [],
      insert = jQuery( selector ),
      last = insert.length - 1;

    for ( ; i <= last; i++ ) {
      elems = i === last ? this : this.clone(true);
      jQuery( insert[i] )[ original ]( elems );

      // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
      core_push.apply( ret, elems.get() );
    }

    return this.pushStack( ret );
  };
});

function getAll( context, tag ) {
  var elems, elem,
    i = 0,
    found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
      typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
      undefined;

  if ( !found ) {
    for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
      if ( !tag || jQuery.nodeName( elem, tag ) ) {
        found.push( elem );
      } else {
        jQuery.merge( found, getAll( elem, tag ) );
      }
    }
  }

  return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
    jQuery.merge( [ context ], found ) :
    found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
  if ( manipulation_rcheckableType.test( elem.type ) ) {
    elem.defaultChecked = elem.checked;
  }
}

jQuery.extend({
  clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    var destElements, node, clone, i, srcElements,
      inPage = jQuery.contains( elem.ownerDocument, elem );

    if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
      clone = elem.cloneNode( true );

    // IE<=8 does not properly clone detached, unknown element nodes
    } else {
      fragmentDiv.innerHTML = elem.outerHTML;
      fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
    }

    if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
        (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

      // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
      destElements = getAll( clone );
      srcElements = getAll( elem );

      // Fix all IE cloning issues
      for ( i = 0; (node = srcElements[i]) != null; ++i ) {
        // Ensure that the destination node is not null; Fixes #9587
        if ( destElements[i] ) {
          fixCloneNodeIssues( node, destElements[i] );
        }
      }
    }

    // Copy the events from the original to the clone
    if ( dataAndEvents ) {
      if ( deepDataAndEvents ) {
        srcElements = srcElements || getAll( elem );
        destElements = destElements || getAll( clone );

        for ( i = 0; (node = srcElements[i]) != null; i++ ) {
          cloneCopyEvent( node, destElements[i] );
        }
      } else {
        cloneCopyEvent( elem, clone );
      }
    }

    // Preserve script evaluation history
    destElements = getAll( clone, "script" );
    if ( destElements.length > 0 ) {
      setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
    }

    destElements = srcElements = node = null;

    // Return the cloned set
    return clone;
  },

  buildFragment: function( elems, context, scripts, selection ) {
    var j, elem, contains,
      tmp, tag, tbody, wrap,
      l = elems.length,

      // Ensure a safe fragment
      safe = createSafeFragment( context ),

      nodes = [],
      i = 0;

    for ( ; i < l; i++ ) {
      elem = elems[ i ];

      if ( elem || elem === 0 ) {

        // Add nodes directly
        if ( jQuery.type( elem ) === "object" ) {
          jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

        // Convert non-html into a text node
        } else if ( !rhtml.test( elem ) ) {
          nodes.push( context.createTextNode( elem ) );

        // Convert html into DOM nodes
        } else {
          tmp = tmp || safe.appendChild( context.createElement("div") );

          // Deserialize a standard representation
          tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
          wrap = wrapMap[ tag ] || wrapMap._default;

          tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

          // Descend through wrappers to the right content
          j = wrap[0];
          while ( j-- ) {
            tmp = tmp.lastChild;
          }

          // Manually add leading whitespace removed by IE
          if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
            nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
          }

          // Remove IE's autoinserted <tbody> from table fragments
          if ( !jQuery.support.tbody ) {

            // String was a <table>, *may* have spurious <tbody>
            elem = tag === "table" && !rtbody.test( elem ) ?
              tmp.firstChild :

              // String was a bare <thead> or <tfoot>
              wrap[1] === "<table>" && !rtbody.test( elem ) ?
                tmp :
                0;

            j = elem && elem.childNodes.length;
            while ( j-- ) {
              if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
                elem.removeChild( tbody );
              }
            }
          }

          jQuery.merge( nodes, tmp.childNodes );

          // Fix #12392 for WebKit and IE > 9
          tmp.textContent = "";

          // Fix #12392 for oldIE
          while ( tmp.firstChild ) {
            tmp.removeChild( tmp.firstChild );
          }

          // Remember the top-level container for proper cleanup
          tmp = safe.lastChild;
        }
      }
    }

    // Fix #11356: Clear elements from fragment
    if ( tmp ) {
      safe.removeChild( tmp );
    }

    // Reset defaultChecked for any radios and checkboxes
    // about to be appended to the DOM in IE 6/7 (#8060)
    if ( !jQuery.support.appendChecked ) {
      jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
    }

    i = 0;
    while ( (elem = nodes[ i++ ]) ) {

      // #4087 - If origin and destination elements are the same, and this is
      // that element, do not do anything
      if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
        continue;
      }

      contains = jQuery.contains( elem.ownerDocument, elem );

      // Append to fragment
      tmp = getAll( safe.appendChild( elem ), "script" );

      // Preserve script evaluation history
      if ( contains ) {
        setGlobalEval( tmp );
      }

      // Capture executables
      if ( scripts ) {
        j = 0;
        while ( (elem = tmp[ j++ ]) ) {
          if ( rscriptType.test( elem.type || "" ) ) {
            scripts.push( elem );
          }
        }
      }
    }

    tmp = null;

    return safe;
  },

  cleanData: function( elems, /* internal */ acceptData ) {
    var elem, type, id, data,
      i = 0,
      internalKey = jQuery.expando,
      cache = jQuery.cache,
      deleteExpando = jQuery.support.deleteExpando,
      special = jQuery.event.special;

    for ( ; (elem = elems[i]) != null; i++ ) {

      if ( acceptData || jQuery.acceptData( elem ) ) {

        id = elem[ internalKey ];
        data = id && cache[ id ];

        if ( data ) {
          if ( data.events ) {
            for ( type in data.events ) {
              if ( special[ type ] ) {
                jQuery.event.remove( elem, type );

              // This is a shortcut to avoid jQuery.event.remove's overhead
              } else {
                jQuery.removeEvent( elem, type, data.handle );
              }
            }
          }

          // Remove cache only if it was not already removed by jQuery.event.remove
          if ( cache[ id ] ) {

            delete cache[ id ];

            // IE does not allow us to delete expando properties from nodes,
            // nor does it have a removeAttribute function on Document nodes;
            // we must handle all of these cases
            if ( deleteExpando ) {
              delete elem[ internalKey ];

            } else if ( typeof elem.removeAttribute !== core_strundefined ) {
              elem.removeAttribute( internalKey );

            } else {
              elem[ internalKey ] = null;
            }

            core_deletedIds.push( id );
          }
        }
      }
    }
  }
});
var iframe, getStyles, curCSS,
  ralpha = /alpha\([^)]*\)/i,
  ropacity = /opacity\s*=\s*([^)]*)/,
  rposition = /^(top|right|bottom|left)$/,
  // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
  // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
  rdisplayswap = /^(none|table(?!-c[ea]).+)/,
  rmargin = /^margin/,
  rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
  rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
  rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
  elemdisplay = { BODY: "block" },

  cssShow = { position: "absolute", visibility: "hidden", display: "block" },
  cssNormalTransform = {
    letterSpacing: 0,
    fontWeight: 400
  },

  cssExpand = [ "Top", "Right", "Bottom", "Left" ],
  cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

  // shortcut for names that are not vendor prefixed
  if ( name in style ) {
    return name;
  }

  // check for vendor prefixed names
  var capName = name.charAt(0).toUpperCase() + name.slice(1),
    origName = name,
    i = cssPrefixes.length;

  while ( i-- ) {
    name = cssPrefixes[ i ] + capName;
    if ( name in style ) {
      return name;
    }
  }

  return origName;
}

function isHidden( elem, el ) {
  // isHidden might be called from jQuery#filter function;
  // in that case, element will be second argument
  elem = el || elem;
  return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
  var display, elem, hidden,
    values = [],
    index = 0,
    length = elements.length;

  for ( ; index < length; index++ ) {
    elem = elements[ index ];
    if ( !elem.style ) {
      continue;
    }

    values[ index ] = jQuery._data( elem, "olddisplay" );
    display = elem.style.display;
    if ( show ) {
      // Reset the inline display of this element to learn if it is
      // being hidden by cascaded rules or not
      if ( !values[ index ] && display === "none" ) {
        elem.style.display = "";
      }

      // Set elements which have been overridden with display: none
      // in a stylesheet to whatever the default browser style is
      // for such an element
      if ( elem.style.display === "" && isHidden( elem ) ) {
        values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
      }
    } else {

      if ( !values[ index ] ) {
        hidden = isHidden( elem );

        if ( display && display !== "none" || !hidden ) {
          jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
        }
      }
    }
  }

  // Set the display of most of the elements in a second loop
  // to avoid the constant reflow
  for ( index = 0; index < length; index++ ) {
    elem = elements[ index ];
    if ( !elem.style ) {
      continue;
    }
    if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
      elem.style.display = show ? values[ index ] || "" : "none";
    }
  }

  return elements;
}

jQuery.fn.extend({
  css: function( name, value ) {
    return jQuery.access( this, function( elem, name, value ) {
      var len, styles,
        map = {},
        i = 0;

      if ( jQuery.isArray( name ) ) {
        styles = getStyles( elem );
        len = name.length;

        for ( ; i < len; i++ ) {
          map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
        }

        return map;
      }

      return value !== undefined ?
        jQuery.style( elem, name, value ) :
        jQuery.css( elem, name );
    }, name, value, arguments.length > 1 );
  },
  show: function() {
    return showHide( this, true );
  },
  hide: function() {
    return showHide( this );
  },
  toggle: function( state ) {
    var bool = typeof state === "boolean";

    return this.each(function() {
      if ( bool ? state : isHidden( this ) ) {
        jQuery( this ).show();
      } else {
        jQuery( this ).hide();
      }
    });
  }
});

jQuery.extend({
  // Add in style property hooks for overriding the default
  // behavior of getting and setting a style property
  cssHooks: {
    opacity: {
      get: function( elem, computed ) {
        if ( computed ) {
          // We should always get a number back from opacity
          var ret = curCSS( elem, "opacity" );
          return ret === "" ? "1" : ret;
        }
      }
    }
  },

  // Exclude the following css properties to add px
  cssNumber: {
    "columnCount": true,
    "fillOpacity": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true
  },

  // Add in properties whose names you wish to fix before
  // setting or getting the value
  cssProps: {
    // normalize float css property
    "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
  },

  // Get and set the style property on a DOM Node
  style: function( elem, name, value, extra ) {
    // Don't set styles on text and comment nodes
    if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
      return;
    }

    // Make sure that we're working with the right name
    var ret, type, hooks,
      origName = jQuery.camelCase( name ),
      style = elem.style;

    name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

    // gets hook for the prefixed version
    // followed by the unprefixed version
    hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    // Check if we're setting a value
    if ( value !== undefined ) {
      type = typeof value;

      // convert relative number strings (+= or -=) to relative numbers. #7345
      if ( type === "string" && (ret = rrelNum.exec( value )) ) {
        value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
        // Fixes bug #9237
        type = "number";
      }

      // Make sure that NaN and null values aren't set. See: #7116
      if ( value == null || type === "number" && isNaN( value ) ) {
        return;
      }

      // If a number was passed in, add 'px' to the (except for certain CSS properties)
      if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
        value += "px";
      }

      // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
      // but it would mean to define eight (for every problematic property) identical functions
      if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
        style[ name ] = "inherit";
      }

      // If a hook was provided, use that value, otherwise just set the specified value
      if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

        // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
        // Fixes bug #5509
        try {
          style[ name ] = value;
        } catch(e) {}
      }

    } else {
      // If a hook was provided get the non-computed value from there
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
        return ret;
      }

      // Otherwise just get the value from the style object
      return style[ name ];
    }
  },

  css: function( elem, name, extra, styles ) {
    var num, val, hooks,
      origName = jQuery.camelCase( name );

    // Make sure that we're working with the right name
    name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

    // gets hook for the prefixed version
    // followed by the unprefixed version
    hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    // If a hook was provided get the computed value from there
    if ( hooks && "get" in hooks ) {
      val = hooks.get( elem, true, extra );
    }

    // Otherwise, if a way to get the computed value exists, use that
    if ( val === undefined ) {
      val = curCSS( elem, name, styles );
    }

    //convert "normal" to computed value
    if ( val === "normal" && name in cssNormalTransform ) {
      val = cssNormalTransform[ name ];
    }

    // Return, converting to number if forced or a qualifier was provided and val looks numeric
    if ( extra === "" || extra ) {
      num = parseFloat( val );
      return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
    }
    return val;
  },

  // A method for quickly swapping in/out CSS properties to get correct calculations
  swap: function( elem, options, callback, args ) {
    var ret, name,
      old = {};

    // Remember the old values, and insert the new ones
    for ( name in options ) {
      old[ name ] = elem.style[ name ];
      elem.style[ name ] = options[ name ];
    }

    ret = callback.apply( elem, args || [] );

    // Revert the old values
    for ( name in options ) {
      elem.style[ name ] = old[ name ];
    }

    return ret;
  }
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
  getStyles = function( elem ) {
    return window.getComputedStyle( elem, null );
  };

  curCSS = function( elem, name, _computed ) {
    var width, minWidth, maxWidth,
      computed = _computed || getStyles( elem ),

      // getPropertyValue is only needed for .css('filter') in IE9, see #12537
      ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
      style = elem.style;

    if ( computed ) {

      if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
        ret = jQuery.style( elem, name );
      }

      // A tribute to the "awesome hack by Dean Edwards"
      // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
      // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
      // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
      if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

        // Remember the original values
        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;

        // Put in the new values to get a computed value out
        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width;

        // Revert the changed values
        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }

    return ret;
  };
} else if ( document.documentElement.currentStyle ) {
  getStyles = function( elem ) {
    return elem.currentStyle;
  };

  curCSS = function( elem, name, _computed ) {
    var left, rs, rsLeft,
      computed = _computed || getStyles( elem ),
      ret = computed ? computed[ name ] : undefined,
      style = elem.style;

    // Avoid setting ret to empty string here
    // so we don't default to auto
    if ( ret == null && style && style[ name ] ) {
      ret = style[ name ];
    }

    // From the awesome hack by Dean Edwards
    // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

    // If we're not dealing with a regular pixel number
    // but a number that has a weird ending, we need to convert it to pixels
    // but not position css attributes, as those are proportional to the parent element instead
    // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
    if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

      // Remember the original values
      left = style.left;
      rs = elem.runtimeStyle;
      rsLeft = rs && rs.left;

      // Put in the new values to get a computed value out
      if ( rsLeft ) {
        rs.left = elem.currentStyle.left;
      }
      style.left = name === "fontSize" ? "1em" : ret;
      ret = style.pixelLeft + "px";

      // Revert the changed values
      style.left = left;
      if ( rsLeft ) {
        rs.left = rsLeft;
      }
    }

    return ret === "" ? "auto" : ret;
  };
}

function setPositiveNumber( elem, value, subtract ) {
  var matches = rnumsplit.exec( value );
  return matches ?
    // Guard against undefined "subtract", e.g., when used as in cssHooks
    Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
    value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
  var i = extra === ( isBorderBox ? "border" : "content" ) ?
    // If we already have the right measurement, avoid augmentation
    4 :
    // Otherwise initialize for horizontal or vertical properties
    name === "width" ? 1 : 0,

    val = 0;

  for ( ; i < 4; i += 2 ) {
    // both box models exclude margin, so add it if we want it
    if ( extra === "margin" ) {
      val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
    }

    if ( isBorderBox ) {
      // border-box includes padding, so remove it if we want content
      if ( extra === "content" ) {
        val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
      }

      // at this point, extra isn't border nor margin, so remove border
      if ( extra !== "margin" ) {
        val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
      }
    } else {
      // at this point, extra isn't content, so add padding
      val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

      // at this point, extra isn't content nor padding, so add border
      if ( extra !== "padding" ) {
        val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
      }
    }
  }

  return val;
}

function getWidthOrHeight( elem, name, extra ) {

  // Start with offset property, which is equivalent to the border-box value
  var valueIsBorderBox = true,
    val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
    styles = getStyles( elem ),
    isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

  // some non-html elements return undefined for offsetWidth, so check for null/undefined
  // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
  // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
  if ( val <= 0 || val == null ) {
    // Fall back to computed then uncomputed css if necessary
    val = curCSS( elem, name, styles );
    if ( val < 0 || val == null ) {
      val = elem.style[ name ];
    }

    // Computed unit is not pixels. Stop here and return.
    if ( rnumnonpx.test(val) ) {
      return val;
    }

    // we need the check for style in case a browser which returns unreliable values
    // for getComputedStyle silently falls back to the reliable elem.style
    valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

    // Normalize "", auto, and prepare for extra
    val = parseFloat( val ) || 0;
  }

  // use the active box-sizing model to add/subtract irrelevant styles
  return ( val +
    augmentWidthOrHeight(
      elem,
      name,
      extra || ( isBorderBox ? "border" : "content" ),
      valueIsBorderBox,
      styles
    )
  ) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
  var doc = document,
    display = elemdisplay[ nodeName ];

  if ( !display ) {
    display = actualDisplay( nodeName, doc );

    // If the simple way fails, read from inside an iframe
    if ( display === "none" || !display ) {
      // Use the already-created iframe if possible
      iframe = ( iframe ||
        jQuery("<iframe frameborder='0' width='0' height='0'/>")
        .css( "cssText", "display:block !important" )
      ).appendTo( doc.documentElement );

      // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
      doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
      doc.write("<!doctype html><html><body>");
      doc.close();

      display = actualDisplay( nodeName, doc );
      iframe.detach();
    }

    // Store the correct default display
    elemdisplay[ nodeName ] = display;
  }

  return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
  var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
    display = jQuery.css( elem[0], "display" );
  elem.remove();
  return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
  jQuery.cssHooks[ name ] = {
    get: function( elem, computed, extra ) {
      if ( computed ) {
        // certain elements can have dimension info if we invisibly show them
        // however, it must have a current display style that would benefit from this
        return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
          jQuery.swap( elem, cssShow, function() {
            return getWidthOrHeight( elem, name, extra );
          }) :
          getWidthOrHeight( elem, name, extra );
      }
    },

    set: function( elem, value, extra ) {
      var styles = extra && getStyles( elem );
      return setPositiveNumber( elem, value, extra ?
        augmentWidthOrHeight(
          elem,
          name,
          extra,
          jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
          styles
        ) : 0
      );
    }
  };
});

if ( !jQuery.support.opacity ) {
  jQuery.cssHooks.opacity = {
    get: function( elem, computed ) {
      // IE uses filters for opacity
      return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
        ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
        computed ? "1" : "";
    },

    set: function( elem, value ) {
      var style = elem.style,
        currentStyle = elem.currentStyle,
        opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
        filter = currentStyle && currentStyle.filter || style.filter || "";

      // IE has trouble with opacity if it does not have layout
      // Force it by setting the zoom level
      style.zoom = 1;

      // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
      // if value === "", then remove inline opacity #12685
      if ( ( value >= 1 || value === "" ) &&
          jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
          style.removeAttribute ) {

        // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
        // if "filter:" is present at all, clearType is disabled, we want to avoid this
        // style.removeAttribute is IE Only, but so apparently is this code path...
        style.removeAttribute( "filter" );

        // if there is no filter style applied in a css rule or unset inline opacity, we are done
        if ( value === "" || currentStyle && !currentStyle.filter ) {
          return;
        }
      }

      // otherwise, set new filter values
      style.filter = ralpha.test( filter ) ?
        filter.replace( ralpha, opacity ) :
        filter + " " + opacity;
    }
  };
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
  if ( !jQuery.support.reliableMarginRight ) {
    jQuery.cssHooks.marginRight = {
      get: function( elem, computed ) {
        if ( computed ) {
          // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
          // Work around by temporarily setting element display to inline-block
          return jQuery.swap( elem, { "display": "inline-block" },
            curCSS, [ elem, "marginRight" ] );
        }
      }
    };
  }

  // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
  // getComputedStyle returns percent when specified for top/left/bottom/right
  // rather than make the css module depend on the offset module, we just check for it here
  if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
    jQuery.each( [ "top", "left" ], function( i, prop ) {
      jQuery.cssHooks[ prop ] = {
        get: function( elem, computed ) {
          if ( computed ) {
            computed = curCSS( elem, prop );
            // if curCSS returns percentage, fallback to offset
            return rnumnonpx.test( computed ) ?
              jQuery( elem ).position()[ prop ] + "px" :
              computed;
          }
        }
      };
    });
  }

});

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.hidden = function( elem ) {
    // Support: Opera <= 12.12
    // Opera reports offsetWidths and offsetHeights less than zero on some elements
    return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
      (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
  };

  jQuery.expr.filters.visible = function( elem ) {
    return !jQuery.expr.filters.hidden( elem );
  };
}

// These hooks are used by animate to expand properties
jQuery.each({
  margin: "",
  padding: "",
  border: "Width"
}, function( prefix, suffix ) {
  jQuery.cssHooks[ prefix + suffix ] = {
    expand: function( value ) {
      var i = 0,
        expanded = {},

        // assumes a single number if not a string
        parts = typeof value === "string" ? value.split(" ") : [ value ];

      for ( ; i < 4; i++ ) {
        expanded[ prefix + cssExpand[ i ] + suffix ] =
          parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
      }

      return expanded;
    }
  };

  if ( !rmargin.test( prefix ) ) {
    jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
  }
});
var r20 = /%20/g,
  rbracket = /\[\]$/,
  rCRLF = /\r?\n/g,
  rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
  rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
  serialize: function() {
    return jQuery.param( this.serializeArray() );
  },
  serializeArray: function() {
    return this.map(function(){
      // Can add propHook for "elements" to filter or add form elements
      var elements = jQuery.prop( this, "elements" );
      return elements ? jQuery.makeArray( elements ) : this;
    })
    .filter(function(){
      var type = this.type;
      // Use .is(":disabled") so that fieldset[disabled] works
      return this.name && !jQuery( this ).is( ":disabled" ) &&
        rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
        ( this.checked || !manipulation_rcheckableType.test( type ) );
    })
    .map(function( i, elem ){
      var val = jQuery( this ).val();

      return val == null ?
        null :
        jQuery.isArray( val ) ?
          jQuery.map( val, function( val ){
            return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
          }) :
          { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    }).get();
  }
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
  var prefix,
    s = [],
    add = function( key, value ) {
      // If value is a function, invoke it and return its value
      value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
      s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
    };

  // Set traditional to true for jQuery <= 1.3.2 behavior.
  if ( traditional === undefined ) {
    traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
  }

  // If an array was passed in, assume that it is an array of form elements.
  if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
    // Serialize the form elements
    jQuery.each( a, function() {
      add( this.name, this.value );
    });

  } else {
    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for ( prefix in a ) {
      buildParams( prefix, a[ prefix ], traditional, add );
    }
  }

  // Return the resulting serialization
  return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
  var name;

  if ( jQuery.isArray( obj ) ) {
    // Serialize array item.
    jQuery.each( obj, function( i, v ) {
      if ( traditional || rbracket.test( prefix ) ) {
        // Treat each array item as a scalar.
        add( prefix, v );

      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
      }
    });

  } else if ( !traditional && jQuery.type( obj ) === "object" ) {
    // Serialize object item.
    for ( name in obj ) {
      buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    }

  } else {
    // Serialize scalar item.
    add( prefix, obj );
  }
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
  "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
  "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

  // Handle event binding
  jQuery.fn[ name ] = function( data, fn ) {
    return arguments.length > 0 ?
      this.on( name, null, data, fn ) :
      this.trigger( name );
  };
});

jQuery.fn.hover = function( fnOver, fnOut ) {
  return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
  // Document location
  ajaxLocParts,
  ajaxLocation,
  ajax_nonce = jQuery.now(),

  ajax_rquery = /\?/,
  rhash = /#.*$/,
  rts = /([?&])_=[^&]*/,
  rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
  // #7653, #8125, #8152: local protocol detection
  rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
  rnoContent = /^(?:GET|HEAD)$/,
  rprotocol = /^\/\//,
  rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

  // Keep a copy of the old load method
  _load = jQuery.fn.load,

  /* Prefilters
   * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
   * 2) These are called:
   *    - BEFORE asking for a transport
   *    - AFTER param serialization (s.data is a string if s.processData is true)
   * 3) key is the dataType
   * 4) the catchall symbol "*" can be used
   * 5) execution will start with transport dataType and THEN continue down to "*" if needed
   */
  prefilters = {},

  /* Transports bindings
   * 1) key is the dataType
   * 2) the catchall symbol "*" can be used
   * 3) selection will start with transport dataType and THEN go to "*" if needed
   */
  transports = {},

  // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
  allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
  ajaxLocation = location.href;
} catch( e ) {
  // Use the href attribute of an A element
  // since IE will modify it given document.location
  ajaxLocation = document.createElement( "a" );
  ajaxLocation.href = "";
  ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

  // dataTypeExpression is optional and defaults to "*"
  return function( dataTypeExpression, func ) {

    if ( typeof dataTypeExpression !== "string" ) {
      func = dataTypeExpression;
      dataTypeExpression = "*";
    }

    var dataType,
      i = 0,
      dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

    if ( jQuery.isFunction( func ) ) {
      // For each dataType in the dataTypeExpression
      while ( (dataType = dataTypes[i++]) ) {
        // Prepend if requested
        if ( dataType[0] === "+" ) {
          dataType = dataType.slice( 1 ) || "*";
          (structure[ dataType ] = structure[ dataType ] || []).unshift( func );

        // Otherwise append
        } else {
          (structure[ dataType ] = structure[ dataType ] || []).push( func );
        }
      }
    }
  };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

  var inspected = {},
    seekingTransport = ( structure === transports );

  function inspect( dataType ) {
    var selected;
    inspected[ dataType ] = true;
    jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
      var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
      if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
        options.dataTypes.unshift( dataTypeOrTransport );
        inspect( dataTypeOrTransport );
        return false;
      } else if ( seekingTransport ) {
        return !( selected = dataTypeOrTransport );
      }
    });
    return selected;
  }

  return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
  var deep, key,
    flatOptions = jQuery.ajaxSettings.flatOptions || {};

  for ( key in src ) {
    if ( src[ key ] !== undefined ) {
      ( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
    }
  }
  if ( deep ) {
    jQuery.extend( true, target, deep );
  }

  return target;
}

jQuery.fn.load = function( url, params, callback ) {
  if ( typeof url !== "string" && _load ) {
    return _load.apply( this, arguments );
  }

  var selector, response, type,
    self = this,
    off = url.indexOf(" ");

  if ( off >= 0 ) {
    selector = url.slice( off, url.length );
    url = url.slice( 0, off );
  }

  // If it's a function
  if ( jQuery.isFunction( params ) ) {

    // We assume that it's the callback
    callback = params;
    params = undefined;

  // Otherwise, build a param string
  } else if ( params && typeof params === "object" ) {
    type = "POST";
  }

  // If we have elements to modify, make the request
  if ( self.length > 0 ) {
    jQuery.ajax({
      url: url,

      // if "type" variable is undefined, then "GET" method will be used
      type: type,
      dataType: "html",
      data: params
    }).done(function( responseText ) {

      // Save response for use in complete callback
      response = arguments;

      self.html( selector ?

        // If a selector was specified, locate the right elements in a dummy div
        // Exclude scripts to avoid IE 'Permission Denied' errors
        jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

        // Otherwise use the full result
        responseText );

    }).complete( callback && function( jqXHR, status ) {
      self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
    });
  }

  return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
  jQuery.fn[ type ] = function( fn ){
    return this.on( type, fn );
  };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    // shift arguments if data argument was omitted
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});

jQuery.extend({

  // Counter for holding the number of active queries
  active: 0,

  // Last-Modified header cache for next request
  lastModified: {},
  etag: {},

  ajaxSettings: {
    url: ajaxLocation,
    type: "GET",
    isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
    global: true,
    processData: true,
    async: true,
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    /*
    timeout: 0,
    data: null,
    dataType: null,
    username: null,
    password: null,
    cache: null,
    throws: false,
    traditional: false,
    headers: {},
    */

    accepts: {
      "*": allTypes,
      text: "text/plain",
      html: "text/html",
      xml: "application/xml, text/xml",
      json: "application/json, text/javascript"
    },

    contents: {
      xml: /xml/,
      html: /html/,
      json: /json/
    },

    responseFields: {
      xml: "responseXML",
      text: "responseText"
    },

    // Data converters
    // Keys separate source (or catchall "*") and destination types with a single space
    converters: {

      // Convert anything to text
      "* text": window.String,

      // Text to html (true = no transformation)
      "text html": true,

      // Evaluate text as a json expression
      "text json": jQuery.parseJSON,

      // Parse text as xml
      "text xml": jQuery.parseXML
    },

    // For options that shouldn't be deep extended:
    // you can add your own custom options here if
    // and when you create one that shouldn't be
    // deep extended (see ajaxExtend)
    flatOptions: {
      url: true,
      context: true
    }
  },

  // Creates a full fledged settings object into target
  // with both ajaxSettings and settings fields.
  // If target is omitted, writes into ajaxSettings.
  ajaxSetup: function( target, settings ) {
    return settings ?

      // Building a settings object
      ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

      // Extending ajaxSettings
      ajaxExtend( jQuery.ajaxSettings, target );
  },

  ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
  ajaxTransport: addToPrefiltersOrTransports( transports ),

  // Main method
  ajax: function( url, options ) {

    // If url is an object, simulate pre-1.5 signature
    if ( typeof url === "object" ) {
      options = url;
      url = undefined;
    }

    // Force options to be an object
    options = options || {};

    var // Cross-domain detection vars
      parts,
      // Loop variable
      i,
      // URL without anti-cache param
      cacheURL,
      // Response headers as string
      responseHeadersString,
      // timeout handle
      timeoutTimer,

      // To know if global events are to be dispatched
      fireGlobals,

      transport,
      // Response headers
      responseHeaders,
      // Create the final options object
      s = jQuery.ajaxSetup( {}, options ),
      // Callbacks context
      callbackContext = s.context || s,
      // Context for global events is callbackContext if it is a DOM node or jQuery collection
      globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
        jQuery( callbackContext ) :
        jQuery.event,
      // Deferreds
      deferred = jQuery.Deferred(),
      completeDeferred = jQuery.Callbacks("once memory"),
      // Status-dependent callbacks
      statusCode = s.statusCode || {},
      // Headers (they are sent all at once)
      requestHeaders = {},
      requestHeadersNames = {},
      // The jqXHR state
      state = 0,
      // Default abort message
      strAbort = "canceled",
      // Fake xhr
      jqXHR = {
        readyState: 0,

        // Builds headers hashtable if needed
        getResponseHeader: function( key ) {
          var match;
          if ( state === 2 ) {
            if ( !responseHeaders ) {
              responseHeaders = {};
              while ( (match = rheaders.exec( responseHeadersString )) ) {
                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
              }
            }
            match = responseHeaders[ key.toLowerCase() ];
          }
          return match == null ? null : match;
        },

        // Raw string
        getAllResponseHeaders: function() {
          return state === 2 ? responseHeadersString : null;
        },

        // Caches the header
        setRequestHeader: function( name, value ) {
          var lname = name.toLowerCase();
          if ( !state ) {
            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
            requestHeaders[ name ] = value;
          }
          return this;
        },

        // Overrides response content-type header
        overrideMimeType: function( type ) {
          if ( !state ) {
            s.mimeType = type;
          }
          return this;
        },

        // Status-dependent callbacks
        statusCode: function( map ) {
          var code;
          if ( map ) {
            if ( state < 2 ) {
              for ( code in map ) {
                // Lazy-add the new callback in a way that preserves old ones
                statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
              }
            } else {
              // Execute the appropriate callbacks
              jqXHR.always( map[ jqXHR.status ] );
            }
          }
          return this;
        },

        // Cancel the request
        abort: function( statusText ) {
          var finalText = statusText || strAbort;
          if ( transport ) {
            transport.abort( finalText );
          }
          done( 0, finalText );
          return this;
        }
      };

    // Attach deferreds
    deferred.promise( jqXHR ).complete = completeDeferred.add;
    jqXHR.success = jqXHR.done;
    jqXHR.error = jqXHR.fail;

    // Remove hash character (#7531: and string promotion)
    // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
    // Handle falsy url in the settings object (#10093: consistency with old signature)
    // We also use the url parameter if available
    s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

    // Alias method option to type as per ticket #12004
    s.type = options.method || options.type || s.method || s.type;

    // Extract dataTypes list
    s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

    // A cross-domain request is in order when we have a protocol:host:port mismatch
    if ( s.crossDomain == null ) {
      parts = rurl.exec( s.url.toLowerCase() );
      s.crossDomain = !!( parts &&
        ( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
          ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
            ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
      );
    }

    // Convert data if not already a string
    if ( s.data && s.processData && typeof s.data !== "string" ) {
      s.data = jQuery.param( s.data, s.traditional );
    }

    // Apply prefilters
    inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

    // If request was aborted inside a prefilter, stop there
    if ( state === 2 ) {
      return jqXHR;
    }

    // We can fire global events as of now if asked to
    fireGlobals = s.global;

    // Watch for a new set of requests
    if ( fireGlobals && jQuery.active++ === 0 ) {
      jQuery.event.trigger("ajaxStart");
    }

    // Uppercase the type
    s.type = s.type.toUpperCase();

    // Determine if request has content
    s.hasContent = !rnoContent.test( s.type );

    // Save the URL in case we're toying with the If-Modified-Since
    // and/or If-None-Match header later on
    cacheURL = s.url;

    // More options handling for requests with no content
    if ( !s.hasContent ) {

      // If data is available, append data to url
      if ( s.data ) {
        cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
        // #9682: remove data so that it's not used in an eventual retry
        delete s.data;
      }

      // Add anti-cache in url if needed
      if ( s.cache === false ) {
        s.url = rts.test( cacheURL ) ?

          // If there is already a '_' parameter, set its value
          cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

          // Otherwise add one to the end
          cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
      }
    }

    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    if ( s.ifModified ) {
      if ( jQuery.lastModified[ cacheURL ] ) {
        jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
      }
      if ( jQuery.etag[ cacheURL ] ) {
        jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
      }
    }

    // Set the correct header, if data is being sent
    if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
      jqXHR.setRequestHeader( "Content-Type", s.contentType );
    }

    // Set the Accepts header for the server, depending on the dataType
    jqXHR.setRequestHeader(
      "Accept",
      s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
        s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
        s.accepts[ "*" ]
    );

    // Check for headers option
    for ( i in s.headers ) {
      jqXHR.setRequestHeader( i, s.headers[ i ] );
    }

    // Allow custom headers/mimetypes and early abort
    if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
      // Abort if not done already and return
      return jqXHR.abort();
    }

    // aborting is no longer a cancellation
    strAbort = "abort";

    // Install callbacks on deferreds
    for ( i in { success: 1, error: 1, complete: 1 } ) {
      jqXHR[ i ]( s[ i ] );
    }

    // Get transport
    transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

    // If no transport, we auto-abort
    if ( !transport ) {
      done( -1, "No Transport" );
    } else {
      jqXHR.readyState = 1;

      // Send global event
      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
      }
      // Timeout
      if ( s.async && s.timeout > 0 ) {
        timeoutTimer = setTimeout(function() {
          jqXHR.abort("timeout");
        }, s.timeout );
      }

      try {
        state = 1;
        transport.send( requestHeaders, done );
      } catch ( e ) {
        // Propagate exception as error if not done
        if ( state < 2 ) {
          done( -1, e );
        // Simply rethrow otherwise
        } else {
          throw e;
        }
      }
    }

    // Callback for when everything is done
    function done( status, nativeStatusText, responses, headers ) {
      var isSuccess, success, error, response, modified,
        statusText = nativeStatusText;

      // Called once
      if ( state === 2 ) {
        return;
      }

      // State is "done" now
      state = 2;

      // Clear timeout if it exists
      if ( timeoutTimer ) {
        clearTimeout( timeoutTimer );
      }

      // Dereference transport for early garbage collection
      // (no matter how long the jqXHR object will be used)
      transport = undefined;

      // Cache response headers
      responseHeadersString = headers || "";

      // Set readyState
      jqXHR.readyState = status > 0 ? 4 : 0;

      // Get response data
      if ( responses ) {
        response = ajaxHandleResponses( s, jqXHR, responses );
      }

      // If successful, handle type chaining
      if ( status >= 200 && status < 300 || status === 304 ) {

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {
          modified = jqXHR.getResponseHeader("Last-Modified");
          if ( modified ) {
            jQuery.lastModified[ cacheURL ] = modified;
          }
          modified = jqXHR.getResponseHeader("etag");
          if ( modified ) {
            jQuery.etag[ cacheURL ] = modified;
          }
        }

        // if no content
        if ( status === 204 ) {
          isSuccess = true;
          statusText = "nocontent";

        // if not modified
        } else if ( status === 304 ) {
          isSuccess = true;
          statusText = "notmodified";

        // If we have data, let's convert it
        } else {
          isSuccess = ajaxConvert( s, response );
          statusText = isSuccess.state;
          success = isSuccess.data;
          error = isSuccess.error;
          isSuccess = !error;
        }
      } else {
        // We extract error from statusText
        // then normalize statusText and status for non-aborts
        error = statusText;
        if ( status || !statusText ) {
          statusText = "error";
          if ( status < 0 ) {
            status = 0;
          }
        }
      }

      // Set data for the fake xhr object
      jqXHR.status = status;
      jqXHR.statusText = ( nativeStatusText || statusText ) + "";

      // Success/Error
      if ( isSuccess ) {
        deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
      } else {
        deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
      }

      // Status-dependent callbacks
      jqXHR.statusCode( statusCode );
      statusCode = undefined;

      if ( fireGlobals ) {
        globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
          [ jqXHR, s, isSuccess ? success : error ] );
      }

      // Complete
      completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
        // Handle the global AJAX counter
        if ( !( --jQuery.active ) ) {
          jQuery.event.trigger("ajaxStop");
        }
      }
    }

    return jqXHR;
  },

  getScript: function( url, callback ) {
    return jQuery.get( url, undefined, callback, "script" );
  },

  getJSON: function( url, data, callback ) {
    return jQuery.get( url, data, callback, "json" );
  }
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
  var firstDataType, ct, finalDataType, type,
    contents = s.contents,
    dataTypes = s.dataTypes,
    responseFields = s.responseFields;

  // Fill responseXXX fields
  for ( type in responseFields ) {
    if ( type in responses ) {
      jqXHR[ responseFields[type] ] = responses[ type ];
    }
  }

  // Remove auto dataType and get content-type in the process
  while( dataTypes[ 0 ] === "*" ) {
    dataTypes.shift();
    if ( ct === undefined ) {
      ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
    }
  }

  // Check if we're dealing with a known content-type
  if ( ct ) {
    for ( type in contents ) {
      if ( contents[ type ] && contents[ type ].test( ct ) ) {
        dataTypes.unshift( type );
        break;
      }
    }
  }

  // Check to see if we have a response for the expected dataType
  if ( dataTypes[ 0 ] in responses ) {
    finalDataType = dataTypes[ 0 ];
  } else {
    // Try convertible dataTypes
    for ( type in responses ) {
      if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
        finalDataType = type;
        break;
      }
      if ( !firstDataType ) {
        firstDataType = type;
      }
    }
    // Or just use first one
    finalDataType = finalDataType || firstDataType;
  }

  // If we found a dataType
  // We add the dataType to the list if needed
  // and return the corresponding response
  if ( finalDataType ) {
    if ( finalDataType !== dataTypes[ 0 ] ) {
      dataTypes.unshift( finalDataType );
    }
    return responses[ finalDataType ];
  }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
  var conv2, current, conv, tmp,
    converters = {},
    i = 0,
    // Work with a copy of dataTypes in case we need to modify it for conversion
    dataTypes = s.dataTypes.slice(),
    prev = dataTypes[ 0 ];

  // Apply the dataFilter if provided
  if ( s.dataFilter ) {
    response = s.dataFilter( response, s.dataType );
  }

  // Create converters map with lowercased keys
  if ( dataTypes[ 1 ] ) {
    for ( conv in s.converters ) {
      converters[ conv.toLowerCase() ] = s.converters[ conv ];
    }
  }

  // Convert to each sequential dataType, tolerating list modification
  for ( ; (current = dataTypes[++i]); ) {

    // There's only work to do if current dataType is non-auto
    if ( current !== "*" ) {

      // Convert response if prev dataType is non-auto and differs from current
      if ( prev !== "*" && prev !== current ) {

        // Seek a direct converter
        conv = converters[ prev + " " + current ] || converters[ "* " + current ];

        // If none found, seek a pair
        if ( !conv ) {
          for ( conv2 in converters ) {

            // If conv2 outputs current
            tmp = conv2.split(" ");
            if ( tmp[ 1 ] === current ) {

              // If prev can be converted to accepted input
              conv = converters[ prev + " " + tmp[ 0 ] ] ||
                converters[ "* " + tmp[ 0 ] ];
              if ( conv ) {
                // Condense equivalence converters
                if ( conv === true ) {
                  conv = converters[ conv2 ];

                // Otherwise, insert the intermediate dataType
                } else if ( converters[ conv2 ] !== true ) {
                  current = tmp[ 0 ];
                  dataTypes.splice( i--, 0, current );
                }

                break;
              }
            }
          }
        }

        // Apply converter (if not an equivalence)
        if ( conv !== true ) {

          // Unless errors are allowed to bubble, catch and return them
          if ( conv && s["throws"] ) {
            response = conv( response );
          } else {
            try {
              response = conv( response );
            } catch ( e ) {
              return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
            }
          }
        }
      }

      // Update prev for next iteration
      prev = current;
    }
  }

  return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
  accepts: {
    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
  },
  contents: {
    script: /(?:java|ecma)script/
  },
  converters: {
    "text script": function( text ) {
      jQuery.globalEval( text );
      return text;
    }
  }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
  if ( s.cache === undefined ) {
    s.cache = false;
  }
  if ( s.crossDomain ) {
    s.type = "GET";
    s.global = false;
  }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

  // This transport only deals with cross domain requests
  if ( s.crossDomain ) {

    var script,
      head = document.head || jQuery("head")[0] || document.documentElement;

    return {

      send: function( _, callback ) {

        script = document.createElement("script");

        script.async = true;

        if ( s.scriptCharset ) {
          script.charset = s.scriptCharset;
        }

        script.src = s.url;

        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function( _, isAbort ) {

          if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;

            // Remove the script
            if ( script.parentNode ) {
              script.parentNode.removeChild( script );
            }

            // Dereference the script
            script = null;

            // Callback if not abort
            if ( !isAbort ) {
              callback( 200, "success" );
            }
          }
        };

        // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
        // Use native DOM manipulation to avoid our domManip AJAX trickery
        head.insertBefore( script, head.firstChild );
      },

      abort: function() {
        if ( script ) {
          script.onload( undefined, true );
        }
      }
    };
  }
});
var oldCallbacks = [],
  rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
  jsonp: "callback",
  jsonpCallback: function() {
    var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
    this[ callback ] = true;
    return callback;
  }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

  var callbackName, overwritten, responseContainer,
    jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
      "url" :
      typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
    );

  // Handle iff the expected data type is "jsonp" or we have a parameter to set
  if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

    // Get callback name, remembering preexisting value associated with it
    callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
      s.jsonpCallback() :
      s.jsonpCallback;

    // Insert callback into url or form data
    if ( jsonProp ) {
      s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
    } else if ( s.jsonp !== false ) {
      s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
    }

    // Use data converter to retrieve json after script execution
    s.converters["script json"] = function() {
      if ( !responseContainer ) {
        jQuery.error( callbackName + " was not called" );
      }
      return responseContainer[ 0 ];
    };

    // force json dataType
    s.dataTypes[ 0 ] = "json";

    // Install callback
    overwritten = window[ callbackName ];
    window[ callbackName ] = function() {
      responseContainer = arguments;
    };

    // Clean-up function (fires after converters)
    jqXHR.always(function() {
      // Restore preexisting value
      window[ callbackName ] = overwritten;

      // Save back as free
      if ( s[ callbackName ] ) {
        // make sure that re-using the options doesn't screw things around
        s.jsonpCallback = originalSettings.jsonpCallback;

        // save the callback name for future use
        oldCallbacks.push( callbackName );
      }

      // Call if it was a function and we have a response
      if ( responseContainer && jQuery.isFunction( overwritten ) ) {
        overwritten( responseContainer[ 0 ] );
      }

      responseContainer = overwritten = undefined;
    });

    // Delegate to script
    return "script";
  }
});
var xhrCallbacks, xhrSupported,
  xhrId = 0,
  // #5280: Internet Explorer will keep connections alive if we don't abort on unload
  xhrOnUnloadAbort = window.ActiveXObject && function() {
    // Abort all pending requests
    var key;
    for ( key in xhrCallbacks ) {
      xhrCallbacks[ key ]( undefined, true );
    }
  };

// Functions to create xhrs
function createStandardXHR() {
  try {
    return new window.XMLHttpRequest();
  } catch( e ) {}
}

function createActiveXHR() {
  try {
    return new window.ActiveXObject("Microsoft.XMLHTTP");
  } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
  /* Microsoft failed to properly
   * implement the XMLHttpRequest in IE7 (can't request local files),
   * so we use the ActiveXObject when it is available
   * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
   * we need a fallback.
   */
  function() {
    return !this.isLocal && createStandardXHR() || createActiveXHR();
  } :
  // For all other browsers, use the standard XMLHttpRequest object
  createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

  jQuery.ajaxTransport(function( s ) {
    // Cross domain only allowed if supported through XMLHttpRequest
    if ( !s.crossDomain || jQuery.support.cors ) {

      var callback;

      return {
        send: function( headers, complete ) {

          // Get a new xhr
          var handle, i,
            xhr = s.xhr();

          // Open the socket
          // Passing null username, generates a login popup on Opera (#2865)
          if ( s.username ) {
            xhr.open( s.type, s.url, s.async, s.username, s.password );
          } else {
            xhr.open( s.type, s.url, s.async );
          }

          // Apply custom fields if provided
          if ( s.xhrFields ) {
            for ( i in s.xhrFields ) {
              xhr[ i ] = s.xhrFields[ i ];
            }
          }

          // Override mime type if needed
          if ( s.mimeType && xhr.overrideMimeType ) {
            xhr.overrideMimeType( s.mimeType );
          }

          // X-Requested-With header
          // For cross-domain requests, seeing as conditions for a preflight are
          // akin to a jigsaw puzzle, we simply never set it to be sure.
          // (it can always be set on a per-request basis or even using ajaxSetup)
          // For same-domain requests, won't change header if already provided.
          if ( !s.crossDomain && !headers["X-Requested-With"] ) {
            headers["X-Requested-With"] = "XMLHttpRequest";
          }

          // Need an extra try/catch for cross domain requests in Firefox 3
          try {
            for ( i in headers ) {
              xhr.setRequestHeader( i, headers[ i ] );
            }
          } catch( err ) {}

          // Do send the request
          // This may raise an exception which is actually
          // handled in jQuery.ajax (so no try/catch here)
          xhr.send( ( s.hasContent && s.data ) || null );

          // Listener
          callback = function( _, isAbort ) {
            var status, responseHeaders, statusText, responses;

            // Firefox throws exceptions when accessing properties
            // of an xhr when a network error occurred
            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
            try {

              // Was never called and is aborted or complete
              if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                // Only called once
                callback = undefined;

                // Do not keep as active anymore
                if ( handle ) {
                  xhr.onreadystatechange = jQuery.noop;
                  if ( xhrOnUnloadAbort ) {
                    delete xhrCallbacks[ handle ];
                  }
                }

                // If it's an abort
                if ( isAbort ) {
                  // Abort it manually if needed
                  if ( xhr.readyState !== 4 ) {
                    xhr.abort();
                  }
                } else {
                  responses = {};
                  status = xhr.status;
                  responseHeaders = xhr.getAllResponseHeaders();

                  // When requesting binary data, IE6-9 will throw an exception
                  // on any attempt to access responseText (#11426)
                  if ( typeof xhr.responseText === "string" ) {
                    responses.text = xhr.responseText;
                  }

                  // Firefox throws an exception when accessing
                  // statusText for faulty cross-domain requests
                  try {
                    statusText = xhr.statusText;
                  } catch( e ) {
                    // We normalize with Webkit giving an empty statusText
                    statusText = "";
                  }

                  // Filter status for non standard behaviors

                  // If the request is local and we have data: assume a success
                  // (success with no data won't get notified, that's the best we
                  // can do given current implementations)
                  if ( !status && s.isLocal && !s.crossDomain ) {
                    status = responses.text ? 200 : 404;
                  // IE - #1450: sometimes returns 1223 when it should be 204
                  } else if ( status === 1223 ) {
                    status = 204;
                  }
                }
              }
            } catch( firefoxAccessException ) {
              if ( !isAbort ) {
                complete( -1, firefoxAccessException );
              }
            }

            // Call complete if needed
            if ( responses ) {
              complete( status, statusText, responses, responseHeaders );
            }
          };

          if ( !s.async ) {
            // if we're in sync mode we fire the callback
            callback();
          } else if ( xhr.readyState === 4 ) {
            // (IE6 & IE7) if it's in cache and has been
            // retrieved directly we need to fire the callback
            setTimeout( callback );
          } else {
            handle = ++xhrId;
            if ( xhrOnUnloadAbort ) {
              // Create the active xhrs callbacks list if needed
              // and attach the unload handler
              if ( !xhrCallbacks ) {
                xhrCallbacks = {};
                jQuery( window ).unload( xhrOnUnloadAbort );
              }
              // Add to list of active xhrs callbacks
              xhrCallbacks[ handle ] = callback;
            }
            xhr.onreadystatechange = callback;
          }
        },

        abort: function() {
          if ( callback ) {
            callback( undefined, true );
          }
        }
      };
    }
  });
}
var fxNow, timerId,
  rfxtypes = /^(?:toggle|show|hide)$/,
  rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
  rrun = /queueHooks$/,
  animationPrefilters = [ defaultPrefilter ],
  tweeners = {
    "*": [function( prop, value ) {
      var end, unit,
        tween = this.createTween( prop, value ),
        parts = rfxnum.exec( value ),
        target = tween.cur(),
        start = +target || 0,
        scale = 1,
        maxIterations = 20;

      if ( parts ) {
        end = +parts[2];
        unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

        // We need to compute starting value
        if ( unit !== "px" && start ) {
          // Iteratively approximate from a nonzero starting point
          // Prefer the current property, because this process will be trivial if it uses the same units
          // Fallback to end or a simple constant
          start = jQuery.css( tween.elem, prop, true ) || end || 1;

          do {
            // If previous iteration zeroed out, double until we get *something*
            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
            scale = scale || ".5";

            // Adjust and apply
            start = start / scale;
            jQuery.style( tween.elem, prop, start + unit );

          // Update scale, tolerating zero or NaN from tween.cur()
          // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
          } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
        }

        tween.unit = unit;
        tween.start = start;
        // If a +=/-= token was provided, we're doing a relative animation
        tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
      }
      return tween;
    }]
  };

// Animations created synchronously will run synchronously
function createFxNow() {
  setTimeout(function() {
    fxNow = undefined;
  });
  return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
  jQuery.each( props, function( prop, value ) {
    var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
      index = 0,
      length = collection.length;
    for ( ; index < length; index++ ) {
      if ( collection[ index ].call( animation, prop, value ) ) {

        // we're done with this property
        return;
      }
    }
  });
}

function Animation( elem, properties, options ) {
  var result,
    stopped,
    index = 0,
    length = animationPrefilters.length,
    deferred = jQuery.Deferred().always( function() {
      // don't match elem in the :animated selector
      delete tick.elem;
    }),
    tick = function() {
      if ( stopped ) {
        return false;
      }
      var currentTime = fxNow || createFxNow(),
        remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
        // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
        temp = remaining / animation.duration || 0,
        percent = 1 - temp,
        index = 0,
        length = animation.tweens.length;

      for ( ; index < length ; index++ ) {
        animation.tweens[ index ].run( percent );
      }

      deferred.notifyWith( elem, [ animation, percent, remaining ]);

      if ( percent < 1 && length ) {
        return remaining;
      } else {
        deferred.resolveWith( elem, [ animation ] );
        return false;
      }
    },
    animation = deferred.promise({
      elem: elem,
      props: jQuery.extend( {}, properties ),
      opts: jQuery.extend( true, { specialEasing: {} }, options ),
      originalProperties: properties,
      originalOptions: options,
      startTime: fxNow || createFxNow(),
      duration: options.duration,
      tweens: [],
      createTween: function( prop, end ) {
        var tween = jQuery.Tween( elem, animation.opts, prop, end,
            animation.opts.specialEasing[ prop ] || animation.opts.easing );
        animation.tweens.push( tween );
        return tween;
      },
      stop: function( gotoEnd ) {
        var index = 0,
          // if we are going to the end, we want to run all the tweens
          // otherwise we skip this part
          length = gotoEnd ? animation.tweens.length : 0;
        if ( stopped ) {
          return this;
        }
        stopped = true;
        for ( ; index < length ; index++ ) {
          animation.tweens[ index ].run( 1 );
        }

        // resolve when we played the last frame
        // otherwise, reject
        if ( gotoEnd ) {
          deferred.resolveWith( elem, [ animation, gotoEnd ] );
        } else {
          deferred.rejectWith( elem, [ animation, gotoEnd ] );
        }
        return this;
      }
    }),
    props = animation.props;

  propFilter( props, animation.opts.specialEasing );

  for ( ; index < length ; index++ ) {
    result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
    if ( result ) {
      return result;
    }
  }

  createTweens( animation, props );

  if ( jQuery.isFunction( animation.opts.start ) ) {
    animation.opts.start.call( elem, animation );
  }

  jQuery.fx.timer(
    jQuery.extend( tick, {
      elem: elem,
      anim: animation,
      queue: animation.opts.queue
    })
  );

  // attach callbacks from options
  return animation.progress( animation.opts.progress )
    .done( animation.opts.done, animation.opts.complete )
    .fail( animation.opts.fail )
    .always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
  var value, name, index, easing, hooks;

  // camelCase, specialEasing and expand cssHook pass
  for ( index in props ) {
    name = jQuery.camelCase( index );
    easing = specialEasing[ name ];
    value = props[ index ];
    if ( jQuery.isArray( value ) ) {
      easing = value[ 1 ];
      value = props[ index ] = value[ 0 ];
    }

    if ( index !== name ) {
      props[ name ] = value;
      delete props[ index ];
    }

    hooks = jQuery.cssHooks[ name ];
    if ( hooks && "expand" in hooks ) {
      value = hooks.expand( value );
      delete props[ name ];

      // not quite $.extend, this wont overwrite keys already present.
      // also - reusing 'index' from above because we have the correct "name"
      for ( index in value ) {
        if ( !( index in props ) ) {
          props[ index ] = value[ index ];
          specialEasing[ index ] = easing;
        }
      }
    } else {
      specialEasing[ name ] = easing;
    }
  }
}

jQuery.Animation = jQuery.extend( Animation, {

  tweener: function( props, callback ) {
    if ( jQuery.isFunction( props ) ) {
      callback = props;
      props = [ "*" ];
    } else {
      props = props.split(" ");
    }

    var prop,
      index = 0,
      length = props.length;

    for ( ; index < length ; index++ ) {
      prop = props[ index ];
      tweeners[ prop ] = tweeners[ prop ] || [];
      tweeners[ prop ].unshift( callback );
    }
  },

  prefilter: function( callback, prepend ) {
    if ( prepend ) {
      animationPrefilters.unshift( callback );
    } else {
      animationPrefilters.push( callback );
    }
  }
});

function defaultPrefilter( elem, props, opts ) {
  /*jshint validthis:true */
  var prop, index, length,
    value, dataShow, toggle,
    tween, hooks, oldfire,
    anim = this,
    style = elem.style,
    orig = {},
    handled = [],
    hidden = elem.nodeType && isHidden( elem );

  // handle queue: false promises
  if ( !opts.queue ) {
    hooks = jQuery._queueHooks( elem, "fx" );
    if ( hooks.unqueued == null ) {
      hooks.unqueued = 0;
      oldfire = hooks.empty.fire;
      hooks.empty.fire = function() {
        if ( !hooks.unqueued ) {
          oldfire();
        }
      };
    }
    hooks.unqueued++;

    anim.always(function() {
      // doing this makes sure that the complete handler will be called
      // before this completes
      anim.always(function() {
        hooks.unqueued--;
        if ( !jQuery.queue( elem, "fx" ).length ) {
          hooks.empty.fire();
        }
      });
    });
  }

  // height/width overflow pass
  if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
    // Make sure that nothing sneaks out
    // Record all 3 overflow attributes because IE does not
    // change the overflow attribute when overflowX and
    // overflowY are set to the same value
    opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

    // Set display property to inline-block for height/width
    // animations on inline elements that are having width/height animated
    if ( jQuery.css( elem, "display" ) === "inline" &&
        jQuery.css( elem, "float" ) === "none" ) {

      // inline-level elements accept inline-block;
      // block-level elements need to be inline with layout
      if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
        style.display = "inline-block";

      } else {
        style.zoom = 1;
      }
    }
  }

  if ( opts.overflow ) {
    style.overflow = "hidden";
    if ( !jQuery.support.shrinkWrapBlocks ) {
      anim.always(function() {
        style.overflow = opts.overflow[ 0 ];
        style.overflowX = opts.overflow[ 1 ];
        style.overflowY = opts.overflow[ 2 ];
      });
    }
  }


  // show/hide pass
  for ( index in props ) {
    value = props[ index ];
    if ( rfxtypes.exec( value ) ) {
      delete props[ index ];
      toggle = toggle || value === "toggle";
      if ( value === ( hidden ? "hide" : "show" ) ) {
        continue;
      }
      handled.push( index );
    }
  }

  length = handled.length;
  if ( length ) {
    dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
    if ( "hidden" in dataShow ) {
      hidden = dataShow.hidden;
    }

    // store state if its toggle - enables .stop().toggle() to "reverse"
    if ( toggle ) {
      dataShow.hidden = !hidden;
    }
    if ( hidden ) {
      jQuery( elem ).show();
    } else {
      anim.done(function() {
        jQuery( elem ).hide();
      });
    }
    anim.done(function() {
      var prop;
      jQuery._removeData( elem, "fxshow" );
      for ( prop in orig ) {
        jQuery.style( elem, prop, orig[ prop ] );
      }
    });
    for ( index = 0 ; index < length ; index++ ) {
      prop = handled[ index ];
      tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
      orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

      if ( !( prop in dataShow ) ) {
        dataShow[ prop ] = tween.start;
        if ( hidden ) {
          tween.end = tween.start;
          tween.start = prop === "width" || prop === "height" ? 1 : 0;
        }
      }
    }
  }
}

function Tween( elem, options, prop, end, easing ) {
  return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
  constructor: Tween,
  init: function( elem, options, prop, end, easing, unit ) {
    this.elem = elem;
    this.prop = prop;
    this.easing = easing || "swing";
    this.options = options;
    this.start = this.now = this.cur();
    this.end = end;
    this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
  },
  cur: function() {
    var hooks = Tween.propHooks[ this.prop ];

    return hooks && hooks.get ?
      hooks.get( this ) :
      Tween.propHooks._default.get( this );
  },
  run: function( percent ) {
    var eased,
      hooks = Tween.propHooks[ this.prop ];

    if ( this.options.duration ) {
      this.pos = eased = jQuery.easing[ this.easing ](
        percent, this.options.duration * percent, 0, 1, this.options.duration
      );
    } else {
      this.pos = eased = percent;
    }
    this.now = ( this.end - this.start ) * eased + this.start;

    if ( this.options.step ) {
      this.options.step.call( this.elem, this.now, this );
    }

    if ( hooks && hooks.set ) {
      hooks.set( this );
    } else {
      Tween.propHooks._default.set( this );
    }
    return this;
  }
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
  _default: {
    get: function( tween ) {
      var result;

      if ( tween.elem[ tween.prop ] != null &&
        (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
        return tween.elem[ tween.prop ];
      }

      // passing an empty string as a 3rd parameter to .css will automatically
      // attempt a parseFloat and fallback to a string if the parse fails
      // so, simple values such as "10px" are parsed to Float.
      // complex values such as "rotate(1rad)" are returned as is.
      result = jQuery.css( tween.elem, tween.prop, "" );
      // Empty strings, null, undefined and "auto" are converted to 0.
      return !result || result === "auto" ? 0 : result;
    },
    set: function( tween ) {
      // use step hook for back compat - use cssHook if its there - use .style if its
      // available and use plain properties where available
      if ( jQuery.fx.step[ tween.prop ] ) {
        jQuery.fx.step[ tween.prop ]( tween );
      } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
        jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
      } else {
        tween.elem[ tween.prop ] = tween.now;
      }
    }
  }
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
  set: function( tween ) {
    if ( tween.elem.nodeType && tween.elem.parentNode ) {
      tween.elem[ tween.prop ] = tween.now;
    }
  }
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
  var cssFn = jQuery.fn[ name ];
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return speed == null || typeof speed === "boolean" ?
      cssFn.apply( this, arguments ) :
      this.animate( genFx( name, true ), speed, easing, callback );
  };
});

jQuery.fn.extend({
  fadeTo: function( speed, to, easing, callback ) {

    // show any hidden elements after setting opacity to 0
    return this.filter( isHidden ).css( "opacity", 0 ).show()

      // animate to the value specified
      .end().animate({ opacity: to }, speed, easing, callback );
  },
  animate: function( prop, speed, easing, callback ) {
    var empty = jQuery.isEmptyObject( prop ),
      optall = jQuery.speed( speed, easing, callback ),
      doAnimation = function() {
        // Operate on a copy of prop so per-property easing won't be lost
        var anim = Animation( this, jQuery.extend( {}, prop ), optall );
        doAnimation.finish = function() {
          anim.stop( true );
        };
        // Empty animations, or finishing resolves immediately
        if ( empty || jQuery._data( this, "finish" ) ) {
          anim.stop( true );
        }
      };
      doAnimation.finish = doAnimation;

    return empty || optall.queue === false ?
      this.each( doAnimation ) :
      this.queue( optall.queue, doAnimation );
  },
  stop: function( type, clearQueue, gotoEnd ) {
    var stopQueue = function( hooks ) {
      var stop = hooks.stop;
      delete hooks.stop;
      stop( gotoEnd );
    };

    if ( typeof type !== "string" ) {
      gotoEnd = clearQueue;
      clearQueue = type;
      type = undefined;
    }
    if ( clearQueue && type !== false ) {
      this.queue( type || "fx", [] );
    }

    return this.each(function() {
      var dequeue = true,
        index = type != null && type + "queueHooks",
        timers = jQuery.timers,
        data = jQuery._data( this );

      if ( index ) {
        if ( data[ index ] && data[ index ].stop ) {
          stopQueue( data[ index ] );
        }
      } else {
        for ( index in data ) {
          if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
            stopQueue( data[ index ] );
          }
        }
      }

      for ( index = timers.length; index--; ) {
        if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
          timers[ index ].anim.stop( gotoEnd );
          dequeue = false;
          timers.splice( index, 1 );
        }
      }

      // start the next in the queue if the last step wasn't forced
      // timers currently will call their complete callbacks, which will dequeue
      // but only if they were gotoEnd
      if ( dequeue || !gotoEnd ) {
        jQuery.dequeue( this, type );
      }
    });
  },
  finish: function( type ) {
    if ( type !== false ) {
      type = type || "fx";
    }
    return this.each(function() {
      var index,
        data = jQuery._data( this ),
        queue = data[ type + "queue" ],
        hooks = data[ type + "queueHooks" ],
        timers = jQuery.timers,
        length = queue ? queue.length : 0;

      // enable finishing flag on private data
      data.finish = true;

      // empty the queue first
      jQuery.queue( this, type, [] );

      if ( hooks && hooks.cur && hooks.cur.finish ) {
        hooks.cur.finish.call( this );
      }

      // look for any active animations, and finish them
      for ( index = timers.length; index--; ) {
        if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
          timers[ index ].anim.stop( true );
          timers.splice( index, 1 );
        }
      }

      // look for any animations in the old queue and finish them
      for ( index = 0; index < length; index++ ) {
        if ( queue[ index ] && queue[ index ].finish ) {
          queue[ index ].finish.call( this );
        }
      }

      // turn off finishing flag
      delete data.finish;
    });
  }
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
  var which,
    attrs = { height: type },
    i = 0;

  // if we include width, step value is 1 to do all cssExpand values,
  // if we don't include width, step value is 2 to skip over Left and Right
  includeWidth = includeWidth? 1 : 0;
  for( ; i < 4 ; i += 2 - includeWidth ) {
    which = cssExpand[ i ];
    attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
  }

  if ( includeWidth ) {
    attrs.opacity = attrs.width = type;
  }

  return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
  slideDown: genFx("show"),
  slideUp: genFx("hide"),
  slideToggle: genFx("toggle"),
  fadeIn: { opacity: "show" },
  fadeOut: { opacity: "hide" },
  fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return this.animate( props, speed, easing, callback );
  };
});

jQuery.speed = function( speed, easing, fn ) {
  var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
    complete: fn || !fn && easing ||
      jQuery.isFunction( speed ) && speed,
    duration: speed,
    easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
  };

  opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
    opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

  // normalize opt.queue - true/undefined/null -> "fx"
  if ( opt.queue == null || opt.queue === true ) {
    opt.queue = "fx";
  }

  // Queueing
  opt.old = opt.complete;

  opt.complete = function() {
    if ( jQuery.isFunction( opt.old ) ) {
      opt.old.call( this );
    }

    if ( opt.queue ) {
      jQuery.dequeue( this, opt.queue );
    }
  };

  return opt;
};

jQuery.easing = {
  linear: function( p ) {
    return p;
  },
  swing: function( p ) {
    return 0.5 - Math.cos( p*Math.PI ) / 2;
  }
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
  var timer,
    timers = jQuery.timers,
    i = 0;

  fxNow = jQuery.now();

  for ( ; i < timers.length; i++ ) {
    timer = timers[ i ];
    // Checks the timer has not already been removed
    if ( !timer() && timers[ i ] === timer ) {
      timers.splice( i--, 1 );
    }
  }

  if ( !timers.length ) {
    jQuery.fx.stop();
  }
  fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
  if ( timer() && jQuery.timers.push( timer ) ) {
    jQuery.fx.start();
  }
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
  if ( !timerId ) {
    timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
  }
};

jQuery.fx.stop = function() {
  clearInterval( timerId );
  timerId = null;
};

jQuery.fx.speeds = {
  slow: 600,
  fast: 200,
  // Default speed
  _default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.animated = function( elem ) {
    return jQuery.grep(jQuery.timers, function( fn ) {
      return elem === fn.elem;
    }).length;
  };
}
jQuery.fn.offset = function( options ) {
  if ( arguments.length ) {
    return options === undefined ?
      this :
      this.each(function( i ) {
        jQuery.offset.setOffset( this, options, i );
      });
  }

  var docElem, win,
    box = { top: 0, left: 0 },
    elem = this[ 0 ],
    doc = elem && elem.ownerDocument;

  if ( !doc ) {
    return;
  }

  docElem = doc.documentElement;

  // Make sure it's not a disconnected DOM node
  if ( !jQuery.contains( docElem, elem ) ) {
    return box;
  }

  // If we don't have gBCR, just use 0,0 rather than error
  // BlackBerry 5, iOS 3 (original iPhone)
  if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
    box = elem.getBoundingClientRect();
  }
  win = getWindow( doc );
  return {
    top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
    left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
  };
};

jQuery.offset = {

  setOffset: function( elem, options, i ) {
    var position = jQuery.css( elem, "position" );

    // set position first, in-case top/left are set even on static elem
    if ( position === "static" ) {
      elem.style.position = "relative";
    }

    var curElem = jQuery( elem ),
      curOffset = curElem.offset(),
      curCSSTop = jQuery.css( elem, "top" ),
      curCSSLeft = jQuery.css( elem, "left" ),
      calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
      props = {}, curPosition = {}, curTop, curLeft;

    // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
    if ( calculatePosition ) {
      curPosition = curElem.position();
      curTop = curPosition.top;
      curLeft = curPosition.left;
    } else {
      curTop = parseFloat( curCSSTop ) || 0;
      curLeft = parseFloat( curCSSLeft ) || 0;
    }

    if ( jQuery.isFunction( options ) ) {
      options = options.call( elem, i, curOffset );
    }

    if ( options.top != null ) {
      props.top = ( options.top - curOffset.top ) + curTop;
    }
    if ( options.left != null ) {
      props.left = ( options.left - curOffset.left ) + curLeft;
    }

    if ( "using" in options ) {
      options.using.call( elem, props );
    } else {
      curElem.css( props );
    }
  }
};


jQuery.fn.extend({

  position: function() {
    if ( !this[ 0 ] ) {
      return;
    }

    var offsetParent, offset,
      parentOffset = { top: 0, left: 0 },
      elem = this[ 0 ];

    // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
    if ( jQuery.css( elem, "position" ) === "fixed" ) {
      // we assume that getBoundingClientRect is available when computed position is fixed
      offset = elem.getBoundingClientRect();
    } else {
      // Get *real* offsetParent
      offsetParent = this.offsetParent();

      // Get correct offsets
      offset = this.offset();
      if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
        parentOffset = offsetParent.offset();
      }

      // Add offsetParent borders
      parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
      parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
    }

    // Subtract parent offsets and element margins
    // note: when an element has margin: auto the offsetLeft and marginLeft
    // are the same in Safari causing offset.left to incorrectly be 0
    return {
      top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
      left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
    };
  },

  offsetParent: function() {
    return this.map(function() {
      var offsetParent = this.offsetParent || document.documentElement;
      while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || document.documentElement;
    });
  }
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
  var top = /Y/.test( prop );

  jQuery.fn[ method ] = function( val ) {
    return jQuery.access( this, function( elem, method, val ) {
      var win = getWindow( elem );

      if ( val === undefined ) {
        return win ? (prop in win) ? win[ prop ] :
          win.document.documentElement[ method ] :
          elem[ method ];
      }

      if ( win ) {
        win.scrollTo(
          !top ? val : jQuery( win ).scrollLeft(),
          top ? val : jQuery( win ).scrollTop()
        );

      } else {
        elem[ method ] = val;
      }
    }, method, val, arguments.length, null );
  };
});

function getWindow( elem ) {
  return jQuery.isWindow( elem ) ?
    elem :
    elem.nodeType === 9 ?
      elem.defaultView || elem.parentWindow :
      false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
  jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
    // margin is only for outerHeight, outerWidth
    jQuery.fn[ funcName ] = function( margin, value ) {
      var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
        extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

      return jQuery.access( this, function( elem, type, value ) {
        var doc;

        if ( jQuery.isWindow( elem ) ) {
          // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
          // isn't a whole lot we can do. See pull request at this URL for discussion:
          // https://github.com/jquery/jquery/pull/764
          return elem.document.documentElement[ "client" + name ];
        }

        // Get document width or height
        if ( elem.nodeType === 9 ) {
          doc = elem.documentElement;

          // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
          // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
          return Math.max(
            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
            elem.body[ "offset" + name ], doc[ "offset" + name ],
            doc[ "client" + name ]
          );
        }

        return value === undefined ?
          // Get width or height on the element, requesting but not forcing parseFloat
          jQuery.css( elem, type, extra ) :

          // Set width or height on the element
          jQuery.style( elem, type, value, extra );
      }, type, chainable ? margin : undefined, chainable, null );
    };
  });
});
// Limit scope pollution from any deprecated API
// (function() {

// })();

// Expose for component
module.exports = jQuery;

// Expose jQuery to the global object
//window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
  define( "jquery", [], function () { return jQuery; } );
}

})( window );

});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-in-groups-of/index.js", function(exports, require, module){

module.exports = function(arr, n){
  var ret = [];
  var group = [];
  var len = arr.length;
  var per = len * (n / len);

  for (var i = 0; i < len; ++i) {
    group.push(arr[i]);
    if ((i + 1) % n == 0) {
      ret.push(group);
      group = [];
    }
  }

  if (group.length) ret.push(group);

  return ret;
};
});
require.register("component-calendar/index.js", function(exports, require, module){

module.exports = require('./lib/calendar');
});
require.register("component-calendar/lib/utils.js", function(exports, require, module){

/**
 * Clamp `month`.
 *
 * @param {Number} month
 * @return {Number}
 * @api public
 */

exports.clamp = function(month){
  if (month > 11) return 0;
  if (month < 0) return 11;
  return month;
};

});
require.register("component-calendar/lib/template.js", function(exports, require, module){
module.exports = '<table class="calendar-table">\n  <thead>\n    <tr>\n      <td class="prev"><a href="#">â†</a></td>\n      <td colspan="5" class="title"><span class="month"></span> <span class="year"></span></td>\n      <td class="next"><a href="#">â†’</a></td>\n    </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>';
});
require.register("component-calendar/lib/calendar.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var o = require('jquery')
  , Emitter = require('emitter')
  , template = require('./template')
  , Days = require('./days')
  , clamp = require('./utils').clamp;

/**
 * Expose `Calendar`.
 */

module.exports = Calendar;

/**
 * Initialize a new `Calendar`
 * with the given `date` defaulting
 * to now.
 *
 * Events:
 *
 *  - `prev` when the prev link is clicked
 *  - `next` when the next link is clicked
 *  - `change` (date) when the selected date is modified
 *
 * @params {Date} date
 * @api public
 */

function Calendar(date) {
  Emitter.call(this);
  var self = this;
  this.el = o('<div class=calendar></div>');
  this.days = new Days;
  this.el.append(this.days.el);
  this.on('change', this.show.bind(this));
  this.days.on('prev', this.prev.bind(this));
  this.days.on('next', this.next.bind(this));
  this.days.on('year', this.menuChange.bind(this, 'year'));
  this.days.on('month', this.menuChange.bind(this, 'month'));
  this.show(date || new Date);
  this.days.on('change', function(date){
    self.emit('change', date);
  });
}

/**
 * Mixin emitter.
 */

Emitter(Calendar.prototype);

/**
 * Add class `name` to differentiate this
 * specific calendar for styling purposes,
 * for example `calendar.addClass('date-picker')`.
 *
 * @param {String} name
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.addClass = function(name){
  this.el.addClass(name);
  return this;
};

/**
 * Select `date`.
 *
 * @param {Date} date
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.select = function(date){
  this.selected = date;
  this.days.select(date);
  this.show(date);
  return this;
};

/**
 * Show `date`.
 *
 * @param {Date} date
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.show = function(date){
  this._date = date;
  this.days.show(date);
  return this;
};

/**
 * Enable a year dropdown.
 *
 * @param {Number} from
 * @param {Number} to
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.showYearSelect = function(from, to){
  from = from || this._date.getFullYear() - 10;
  to = to || this._date.getFullYear() + 10;
  this.days.yearMenu(from, to);
  this.show(this._date);
  return this;
};

/**
 * Enable a month dropdown.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.showMonthSelect = function(){
  this.days.monthMenu();
  this.show(this._date);
  return this;
};

/**
 * Return the previous month.
 *
 * @return {Date}
 * @api private
 */

Calendar.prototype.prevMonth = function(){
  var date = new Date(this._date);
  date.setDate(1);
  date.setMonth(date.getMonth() - 1);
  return date;
};

/**
 * Return the next month.
 *
 * @return {Date}
 * @api private
 */

Calendar.prototype.nextMonth = function(){
  var date = new Date(this._date);
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  return date;
};

/**
 * Show the prev view.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.prev = function(){
  this.show(this.prevMonth());
  this.emit('view change', this.days.selectedMonth(), 'prev');
  return this;
};

/**
 * Show the next view.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.next = function(){
  this.show(this.nextMonth());
  this.emit('view change', this.days.selectedMonth(), 'next');
  return this;
};

/**
 * Switch to the year or month selected by dropdown menu.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.menuChange = function(action){
  var date = this.days.selectedMonth();
  this.show(date);
  this.emit('view change', date, action);
  return this;
};

});
require.register("component-calendar/lib/days.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var o = require('jquery')
  , Emitter = require('emitter')
  , template = require('./template')
  , inGroupsOf = require('in-groups-of')
  , clamp = require('./utils').clamp
  , range = require('range')

/**
 * Days.
 */

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Months.
 */

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Get days in `month` for `year`.
 *
 * @param {Number} month
 * @param {Number} year
 * @return {Number}
 * @api private
 */

function daysInMonth(month, year) {
  return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

/**
 * Check if `year` is a leap year.
 *
 * @param {Number} year
 * @return {Boolean}
 * @api private
 */

function isLeapYear(year) {
  return (0 == year % 400)
    || ((0 == year % 4) && (0 != year % 100))
    || (0 == year);
}

/**
 * Expose `Days`.
 */

module.exports = Days;

/**
 * Initialize a new `Days` view.
 *
 * Emits:
 *
 *   - `prev` when prev link is clicked
 *   - `next` when next link is clicked
 *   - `change` (date) when a date is selected
 *
 * @api public
 */

function Days() {
  Emitter.call(this);
  var self = this;
  this.el = o(template).addClass('calendar-days');
  this.head = this.el.find('thead');
  this.body = this.el.find('tbody');
  this.title = this.head.find('.title');
  this.select(new Date);

  // emit "day"
  this.body.on('click', 'a', function(e){
    var el = o(e.target);
    var data = el.data('date').split('-');
    var year = data[0];
    var month = data[1];
    var day = data[2];
    var date = new Date(year, month, day);
    self.select(date);
    self.emit('change', date);
    return false;
  });

  // emit "prev"
  this.el.find('.prev').click(function(){
    self.emit('prev');
    return false;
  });

  // emit "next"
  this.el.find('.next').click(function(){
    self.emit('next');
    return false;
  });
}

/**
 * Mixin emitter.
 */

Emitter(Days.prototype);

/**
 * Select the given `date`.
 *
 * @param {Date} date
 * @return {Days}
 * @api public
 */

Days.prototype.select = function(date){
  this.selected = date;
  return this;
};

/**
 * Show date selection.
 *
 * @param {Date} date
 * @api public
 */

Days.prototype.show = function(date){
  var year = date.getFullYear();
  var month = date.getMonth();
  this.showSelectedYear(year);
  this.showSelectedMonth(month);
  this.head.find('.subheading').remove();
  this.head.append(this.renderHeading(2));
  this.body.empty();
  this.body.append(this.renderDays(date));
};

/**
 * Enable a year dropdown.
 *
 * @param {Number} from
 * @param {Number} to
 * @api public
 */

Days.prototype.yearMenu = function(from, to){
  this.selectYear = true;
  this.title.find('.year').html(yearDropdown(from, to));
  var self = this;
  this.title.find('.year .calendar-select').change(function(){
    self.emit('year');
    return false;
  });
};

/**
 * Enable a month dropdown.
 *
 * @api public
 */

Days.prototype.monthMenu = function(){
  this.selectMonth = true;
  this.title.find('.month').html(monthDropdown());
  var self = this;
  this.title.find('.month .calendar-select').change(function(){
    self.emit('month');
    return false;
  });
};

/**
 * Return current year of view from title.
 *
 * @api private
 */

Days.prototype.titleYear = function(){
  if (this.selectYear) {
    return this.title.find('.year .calendar-select').val();
  } else {
    return this.title.find('.year').text();
  }
};

/**
 * Return current month of view from title.
 *
 * @api private
 */

Days.prototype.titleMonth = function(){
  if (this.selectMonth) {
    return this.title.find('.month .calendar-select').val();
  } else {
    return this.title.find('.month').text();
  }
};

/**
 * Return a date based on the field-selected month.
 *
 * @api public
 */

Days.prototype.selectedMonth = function(){
  return new Date(this.titleYear(), this.titleMonth(), 1);
};

/**
 * Render days of the week heading with
 * the given `length`, for example 2 for "Tu",
 * 3 for "Tue" etc.
 *
 * @param {String} len
 * @return {Element}
 * @api private
 */

Days.prototype.renderHeading = function(len){
  var rows = '<tr class=subheading>' + days.map(function(day){
    return '<th>' + day.slice(0, len) + '</th>';
  }).join('') + '</tr>';
  return o(rows);
};

/**
 * Render days for `date`.
 *
 * @param {Date} date
 * @return {Element}
 * @api private
 */

Days.prototype.renderDays = function(date){
  var rows = this.rowsFor(date);
  var html = rows.map(function(row){
    return '<tr>' + row.join('') + '</tr>';
  }).join('\n');
  return o(html);
};

/**
 * Return rows array for `date`.
 *
 * This method calculates the "overflow"
 * from the previous month and into
 * the next in order to display an
 * even 5 rows.
 *
 * @param {Date} date
 * @return {Array}
 * @api private
 */

Days.prototype.rowsFor = function(date){
  var selected = this.selected;
  var selectedDay = selected.getDate();
  var selectedMonth = selected.getMonth();
  var selectedYear = selected.getFullYear();
  var month = date.getMonth();
  var year = date.getFullYear();

  // calculate overflow
  var start = new Date(date);
  start.setDate(1);
  var before = start.getDay();
  var total = daysInMonth(month, year);
  var perRow = 7;
  var totalShown = perRow * Math.ceil((total + before) / perRow);
  var after = totalShown - (total + before);
  var cells = [];

  // cells before
  cells = cells.concat(cellsBefore(before, month, year));

  // current cells
  for (var i = 0; i < total; ++i) {
    var day = i + 1;
    var date = 'data-date=' + [year, month, day].join('-');
    if (day == selectedDay && month == selectedMonth && year == selectedYear) {
      cells.push('<td class=selected><a href="#" ' + date + '>' + day + '</a></td>');
    } else {
      cells.push('<td><a href="#" ' + date + '>' + day + '</a></td>');
    }
  }

  // after cells
  cells = cells.concat(cellsAfter(after, month, year));

  return inGroupsOf(cells, 7);
};

/**
 * Update view title or select input for `year`.
 *
 * @param {Number} year
 * @api private
 */

Days.prototype.showSelectedYear = function(year){
  if (this.selectYear) {
    this.title.find('.year .calendar-select').val(year);
  } else {
    this.title.find('.year').text(year);
  }
};

/**
 * Update view title or select input for `month`.
 *
 * @param {Number} month
 * @api private
 */

Days.prototype.showSelectedMonth = function(month) {
  if (this.selectMonth) {
    this.title.find('.month .calendar-select').val(month);
  } else {
    this.title.find('.month').text(months[month]);
  }
};

/**
 * Return `n` days before `month`.
 *
 * @param {Number} n
 * @param {Number} month
 * @return {Array}
 * @api private
 */

function cellsBefore(n, month, year){
  var cells = [];
  if (month == 0) --year;
  var prev = clamp(month - 1);
  var before = daysInMonth(prev, year);
  while (n--) cells.push(prevMonthDay(year, prev, before--));
  return cells.reverse();
}

/**
 * Return `n` days after `month`.
 *
 * @param {Number} n
 * @param {Number} month
 * @return {Array}
 * @api private
 */

function cellsAfter(n, month, year){
  var cells = [];
  var day = 0;
  if (month == 11) ++year;
  var next = clamp(month + 1);
  while (n--) cells.push(nextMonthDay(year, next, ++day));
  return cells;
}

/**
 * Prev month day template.
 */

function prevMonthDay(year, month, day) {
  var date = 'data-date=' + [year, month, day].join('-');
  return '<td><a href="#" ' + date + ' class=prev-day>' + day + '</a></td>';
}

/**
 * Next month day template.
 */

function nextMonthDay(year, month, day) {
  var date = 'data-date=' + [year, month, day].join('-');
  return '<td><a href="#" ' + date + ' class=next-day>' + day + '</a></td>';
}

/**
 * Year dropdown template.
 */

function yearDropdown(from, to) {
  var years = range(from, to, 'inclusive');
  var options = o.map(years, yearOption).join('');
  return '<select class="calendar-select">' + options + '</select>';
}

/**
 * Month dropdown template.
 */

function monthDropdown() {
  var options = o.map(months, monthOption).join('');
  return '<select class="calendar-select">' + options + '</select>';
}

/**
 * Year dropdown option template.
 */

function yearOption(year) {
  return '<option value="' + year + '">' + year + '</option>';
}

/**
 * Month dropdown option template.
 */

function monthOption(month, i) {
  return '<option value="' + i + '">' + month + '</option>';
}

});
require.register("component-event/index.js", function(exports, require, module){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);

  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);

  return fn;
};
});
require.register("component-debounce/index.js", function(exports, require, module){
/**
 * Debounces a function by the given threshold.
 *
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, threshold, execAsap){
  var timeout;

  return function debounced(){
    var obj = this, args = arguments;

    function delayed () {
      if (!execAsap) {
        func.apply(obj, args);
      }
      timeout = null;
    }

    if (timeout) {
      clearTimeout(timeout);
    } else if (execAsap) {
      func.apply(obj, args);
    }

    timeout = setTimeout(delayed, threshold || 100);
  };
};

});
require.register("visionmedia-debug/index.js", function(exports, require, module){
if ('undefined' == typeof window) {
  module.exports = require('./lib/debug');
} else {
  module.exports = require('./debug');
}

});
require.register("visionmedia-debug/debug.js", function(exports, require, module){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

});
require.register("date.com/date.js", function(exports, require, module){
/**
 * Module Dependencies
 */


var Clock = require('clock');
var Calendar = require('calendar');
var event = require('event');
var debounce = require('debounce');
var date = require('date');
var moment = rome.moment;
/**
 * Handle input
 */

var input = document.getElementById('date-input');
var api_post_val = document.getElementById('inlv');
input.oninput = debounce(parse, 200);
/**
 * Parse the time
 */

 var getFormattedTime = function (fourDigitTime){

     var hours24 = parseInt(fourDigitTime.substring(0,2), 10);
     var hours = ((hours24 + 11) % 12) + 1;
     var amPm = hours24 > 11 ? 'pm' : 'am';
     var minutes = fourDigitTime.substring(2);
     return hours + ':' + minutes + amPm;
 };

function parse() {
  var val = input.value;


  var str = val;
  var date_split = str.split(" ");
  var re = /^\d{4}-\d{1,2}-\d{1,2}$/;

  var cal_click = re.test(date_split[0]);
  if (cal_click) {
    var mil_time = getFormattedTime(date_split[1]);
    console.log(mil_time);
    console.log('Calendar Clicked');
  }
  var d = date(val);
  console.log('date',d);
  //cal.select(d); /* select Cal */
  time.innerHTML = t(d);
  var m = moment(d);
  var formatted_time = m.format('YYYY-MM-DD HH:mm');

  console.log('formatted rome', formatted_time);
  rome(inl).setValue(formatted_time);
  api_post_val.innerHTML = formatted_time;



  //human_value.innerHTML = t(d);
}

/**
 * Handle suggestions
 */

var table = document.getElementsByTagName('table')[0];
event.bind(table, 'click', function(e) {
  var target = e.target;
  if ('TD' !== target.nodeName) return;
  input.value = target.innerText;
  parse()
});

/**
 * Place the calendar

var cal = new Calendar;
cal.el.appendTo('.calendar-container');

*/
/**
 * Place a clock in the nav bar
var navClock = document.querySelector('.nav-clock');
var clock = new Clock();
clock.refresh();
navClock.appendChild(clock.el);
setInterval(function() {
  clock.refresh();
}, 1000);
*/
/**
 * Time
 */

var time = document.querySelector('#this-later-demo .this-later-time');
time.innerHTML = t(new Date);

function t(date) {
  var t = date.toTimeString().split(' ')[0];
  var meridiem = 'am';
  var parts = t.split(':');
  parts.pop();
  var h = parts[0];

  if (12 <= h) {
    h = (12 == h) ? h : h - 12;
    meridiem = 'pm';
  }
  t = parts.join(':');
  t = ('0' == t[0]) ? t.slice(1) : t;
  t += meridiem;
  return t;
}

});



require.alias("matthewmueller-date/index.js", "date.com/deps/date/index.js");
require.alias("matthewmueller-date/lib/date.js", "date.com/deps/date/lib/date.js");
require.alias("matthewmueller-date/lib/parser.js", "date.com/deps/date/lib/parser.js");
require.alias("matthewmueller-date/index.js", "date.com/deps/date/index.js");
require.alias("matthewmueller-date/index.js", "date/index.js");
require.alias("visionmedia-debug/index.js", "matthewmueller-date/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "matthewmueller-date/deps/debug/debug.js");

require.alias("matthewmueller-date/index.js", "matthewmueller-date/index.js");
require.alias("matthewmueller-clock/index.js", "date.com/deps/clock/index.js");
require.alias("matthewmueller-clock/template.js", "date.com/deps/clock/template.js");
require.alias("matthewmueller-clock/index.js", "date.com/deps/clock/index.js");
require.alias("matthewmueller-clock/index.js", "clock/index.js");
require.alias("component-domify/index.js", "matthewmueller-clock/deps/domify/index.js");

require.alias("matthewmueller-clock/index.js", "matthewmueller-clock/index.js");
require.alias("component-calendar/index.js", "date.com/deps/calendar/index.js");
require.alias("component-calendar/lib/utils.js", "date.com/deps/calendar/lib/utils.js");
require.alias("component-calendar/lib/template.js", "date.com/deps/calendar/lib/template.js");
require.alias("component-calendar/lib/calendar.js", "date.com/deps/calendar/lib/calendar.js");
require.alias("component-calendar/lib/days.js", "date.com/deps/calendar/lib/days.js");
require.alias("component-calendar/index.js", "calendar/index.js");
require.alias("component-range/index.js", "component-calendar/deps/range/index.js");

require.alias("component-jquery/index.js", "component-calendar/deps/jquery/index.js");

require.alias("component-emitter/index.js", "component-calendar/deps/emitter/index.js");

require.alias("component-in-groups-of/index.js", "component-calendar/deps/in-groups-of/index.js");

require.alias("component-event/index.js", "date.com/deps/event/index.js");
require.alias("component-event/index.js", "event/index.js");

require.alias("component-debounce/index.js", "date.com/deps/debounce/index.js");
require.alias("component-debounce/index.js", "date.com/deps/debounce/index.js");
require.alias("component-debounce/index.js", "debounce/index.js");
require.alias("component-debounce/index.js", "component-debounce/index.js");
require.alias("visionmedia-debug/index.js", "date.com/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "date.com/deps/debug/debug.js");
require.alias("visionmedia-debug/index.js", "debug/index.js");

require.alias("date.com/date.js", "date.com/index.js");

// rome@v1.1.2, MIT licensed. https://github.com/bevacqua/rome
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.rome=t()}}(function(){var t;return function e(t,n,r){function a(o,s){if(!n[o]){if(!t[o]){var u="function"==typeof require&&require;if(!s&&u)return u(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var c=n[o]={exports:{}};t[o][0].call(c.exports,function(e){var n=t[o][1][e];return a(n?n:e)},c,c.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)a(r[o]);return a}({1:[function(t,e){function n(){}var r=e.exports={};r.nextTick=function(){var t="undefined"!=typeof window&&window.setImmediate,e="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(t)return function(t){return window.setImmediate(t)};if(e){var n=[];return window.addEventListener("message",function(t){var e=t.source;if((e===window||null===e)&&"process-tick"===t.data&&(t.stopPropagation(),n.length>0)){var r=n.shift();r()}},!0),function(t){n.push(t),window.postMessage("process-tick","*")}}return function(t){setTimeout(t,0)}}(),r.title="browser",r.browser=!0,r.env={},r.argv=[],r.on=n,r.addListener=n,r.once=n,r.off=n,r.removeListener=n,r.removeAllListeners=n,r.emit=n,r.binding=function(){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(){throw new Error("process.chdir is not supported")}},{}],2:[function(t,e){e.exports=t("./src/contra.emitter.js")},{"./src/contra.emitter.js":3}],3:[function(t,e){(function(t){!function(n,r){"use strict";function a(t,e){return Array.prototype.slice.call(t,e)}function i(t,e,n){t&&s(function(){t.apply(n||null,e||[])})}function o(t,e){var n=e||{},o={};return t===r&&(t={}),t.on=function(e,n){return o[e]?o[e].push(n):o[e]=[n],t},t.once=function(e,n){return n._once=!0,t.on(e,n),t},t.off=function(e,n){var r=arguments.length;if(1===r)delete o[e];else if(0===r)o={};else{var a=o[e];if(!a)return t;a.splice(a.indexOf(n),1)}return t},t.emit=function(){var e=a(arguments),r=e.shift(),s=o[r];if("error"===r&&n.throws!==!1&&!s)throw 1===e.length?e[0]:e;return s?(o[r]=s.filter(function(r){return n.async?i(r,e,t):r.apply(t,e),!r._once}),t):t},t}var s,u=""+r,c="function"==typeof setImmediate;s=c?function(t){setImmediate(t)}:typeof t!==u&&t.nextTick?t.nextTick:function(t){setTimeout(t,0)},typeof e!==u&&e.exports?e.exports=o:(n.contra=n.contra||{},n.contra.emitter=o)}(this)}).call(this,t("FWaASH"))},{FWaASH:1}],4:[function(t,e){function n(t,e,n){var s=!0,u=!0;if(!a(t))throw new TypeError;return n===!1?s=!1:i(n)&&(s="leading"in n?n.leading:s,u="trailing"in n?n.trailing:u),o.leading=s,o.maxWait=e,o.trailing=u,r(t,e,o)}var r=t("lodash.debounce"),a=t("lodash.isfunction"),i=t("lodash.isobject"),o={leading:!1,maxWait:0,trailing:!1};e.exports=n},{"lodash.debounce":5,"lodash.isfunction":8,"lodash.isobject":9}],5:[function(t,e){function n(t,e,n){var s,u,c,d,l,f,h,m=0,y=!1,p=!0;if(!r(t))throw new TypeError;if(e=o(0,e)||0,n===!0){var _=!0;p=!1}else a(n)&&(_=n.leading,y="maxWait"in n&&(o(e,n.maxWait)||0),p="trailing"in n?n.trailing:p);var g=function(){var n=e-(i()-d);if(0>=n){u&&clearTimeout(u);var r=h;u=f=h=void 0,r&&(m=i(),c=t.apply(l,s),f||u||(s=l=null))}else f=setTimeout(g,n)},v=function(){f&&clearTimeout(f),u=f=h=void 0,(p||y!==e)&&(m=i(),c=t.apply(l,s),f||u||(s=l=null))};return function(){if(s=arguments,d=i(),l=this,h=p&&(f||!_),y===!1)var n=_&&!f;else{u||_||(m=d);var r=y-(d-m),a=0>=r;a?(u&&(u=clearTimeout(u)),m=d,c=t.apply(l,s)):u||(u=setTimeout(v,r))}return a&&f?f=clearTimeout(f):f||e===y||(f=setTimeout(g,e)),n&&(a=!0,c=t.apply(l,s)),!a||f||u||(s=l=null),c}}var r=t("lodash.isfunction"),a=t("lodash.isobject"),i=t("lodash.now"),o=Math.max;e.exports=n},{"lodash.isfunction":8,"lodash.isobject":9,"lodash.now":6}],6:[function(t,e){var n=t("lodash._isnative"),r=n(r=Date.now)&&r||function(){return(new Date).getTime()};e.exports=r},{"lodash._isnative":7}],7:[function(t,e){function n(t){return"function"==typeof t&&i.test(t)}var r=Object.prototype,a=r.toString,i=RegExp("^"+String(a).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$");e.exports=n},{}],8:[function(t,e){function n(t){return"function"==typeof t}e.exports=n},{}],9:[function(t,e){function n(t){return!(!t||!r[typeof t])}var r=t("lodash._objecttypes");e.exports=n},{"lodash._objecttypes":10}],10:[function(t,e){var n={"boolean":!1,"function":!0,object:!0,number:!1,string:!1,undefined:!1};e.exports=n},{}],11:[function(e,n){(function(r){(function(a){function i(t,e,n){switch(arguments.length){case 2:return null!=t?t:e;case 3:return null!=t?t:null!=e?e:n;default:throw new Error("Implement me")}}function o(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function s(t,e){function n(){pe.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+t)}var r=!0;return h(function(){return r&&(n(),r=!1),e.apply(this,arguments)},e)}function u(t,e){return function(n){return p(t.call(this,n),e)}}function c(t,e){return function(n){return this.lang().ordinal(t.call(this,n),e)}}function d(){}function l(t){O(t),h(this,t)}function f(t){var e=M(t),n=e.year||0,r=e.quarter||0,a=e.month||0,i=e.week||0,o=e.day||0,s=e.hour||0,u=e.minute||0,c=e.second||0,d=e.millisecond||0;this._milliseconds=+d+1e3*c+6e4*u+36e5*s,this._days=+o+7*i,this._months=+a+3*r+12*n,this._data={},this._bubble()}function h(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return e.hasOwnProperty("toString")&&(t.toString=e.toString),e.hasOwnProperty("valueOf")&&(t.valueOf=e.valueOf),t}function m(t){var e,n={};for(e in t)t.hasOwnProperty(e)&&Fe.hasOwnProperty(e)&&(n[e]=t[e]);return n}function y(t){return 0>t?Math.ceil(t):Math.floor(t)}function p(t,e,n){for(var r=""+Math.abs(t),a=t>=0;r.length<e;)r="0"+r;return(a?n?"+":"":"-")+r}function _(t,e,n,r){var a=e._milliseconds,i=e._days,o=e._months;r=null==r?!0:r,a&&t._d.setTime(+t._d+a*n),i&&le(t,"Date",de(t,"Date")+i*n),o&&ce(t,de(t,"Month")+o*n),r&&pe.updateOffset(t,i||o)}function g(t){return"[object Array]"===Object.prototype.toString.call(t)}function v(t){return"[object Date]"===Object.prototype.toString.call(t)||t instanceof Date}function w(t,e,n){var r,a=Math.min(t.length,e.length),i=Math.abs(t.length-e.length),o=0;for(r=0;a>r;r++)(n&&t[r]!==e[r]||!n&&Y(t[r])!==Y(e[r]))&&o++;return o+i}function b(t){if(t){var e=t.toLowerCase().replace(/(.)s$/,"$1");t=on[t]||sn[e]||e}return t}function M(t){var e,n,r={};for(n in t)t.hasOwnProperty(n)&&(e=b(n),e&&(r[e]=t[n]));return r}function D(t){var e,n;if(0===t.indexOf("week"))e=7,n="day";else{if(0!==t.indexOf("month"))return;e=12,n="month"}pe[t]=function(r,i){var o,s,u=pe.fn._lang[t],c=[];if("number"==typeof r&&(i=r,r=a),s=function(t){var e=pe().utc().set(n,t);return u.call(pe.fn._lang,e,r||"")},null!=i)return s(i);for(o=0;e>o;o++)c.push(s(o));return c}}function Y(t){var e=+t,n=0;return 0!==e&&isFinite(e)&&(n=e>=0?Math.floor(e):Math.ceil(e)),n}function k(t,e){return new Date(Date.UTC(t,e+1,0)).getUTCDate()}function x(t,e,n){return ie(pe([t,11,31+e-n]),e,n).week}function T(t){return S(t)?366:365}function S(t){return t%4===0&&t%100!==0||t%400===0}function O(t){var e;t._a&&-2===t._pf.overflow&&(e=t._a[De]<0||t._a[De]>11?De:t._a[Ye]<1||t._a[Ye]>k(t._a[Me],t._a[De])?Ye:t._a[ke]<0||t._a[ke]>23?ke:t._a[xe]<0||t._a[xe]>59?xe:t._a[Te]<0||t._a[Te]>59?Te:t._a[Se]<0||t._a[Se]>999?Se:-1,t._pf._overflowDayOfYear&&(Me>e||e>Ye)&&(e=Ye),t._pf.overflow=e)}function F(t){return null==t._isValid&&(t._isValid=!isNaN(t._d.getTime())&&t._pf.overflow<0&&!t._pf.empty&&!t._pf.invalidMonth&&!t._pf.nullInput&&!t._pf.invalidFormat&&!t._pf.userInvalidated,t._strict&&(t._isValid=t._isValid&&0===t._pf.charsLeftOver&&0===t._pf.unusedTokens.length)),t._isValid}function C(t){return t?t.toLowerCase().replace("_","-"):t}function A(t,e){return e._isUTC?pe(t).zone(e._offset||0):pe(t).local()}function W(t,e){return e.abbr=t,Oe[t]||(Oe[t]=new d),Oe[t].set(e),Oe[t]}function E(t){delete Oe[t]}function I(t){var n,r,a,i,o=0,s=function(t){if(!Oe[t]&&Ce)try{e("./lang/"+t)}catch(n){}return Oe[t]};if(!t)return pe.fn._lang;if(!g(t)){if(r=s(t))return r;t=[t]}for(;o<t.length;){for(i=C(t[o]).split("-"),n=i.length,a=C(t[o+1]),a=a?a.split("-"):null;n>0;){if(r=s(i.slice(0,n).join("-")))return r;if(a&&a.length>=n&&w(i,a,!0)>=n-1)break;n--}o++}return pe.fn._lang}function H(t){return t.match(/\[[\s\S]/)?t.replace(/^\[|\]$/g,""):t.replace(/\\/g,"")}function G(t){var e,n,r=t.match(Ie);for(e=0,n=r.length;n>e;e++)r[e]=fn[r[e]]?fn[r[e]]:H(r[e]);return function(a){var i="";for(e=0;n>e;e++)i+=r[e]instanceof Function?r[e].call(a,t):r[e];return i}}function N(t,e){return t.isValid()?(e=L(e,t.lang()),un[e]||(un[e]=G(e)),un[e](t)):t.lang().invalidDate()}function L(t,e){function n(t){return e.longDateFormat(t)||t}var r=5;for(He.lastIndex=0;r>=0&&He.test(t);)t=t.replace(He,n),He.lastIndex=0,r-=1;return t}function P(t,e){var n,r=e._strict;switch(t){case"Q":return Be;case"DDDD":return $e;case"YYYY":case"GGGG":case"gggg":return r?Je:Le;case"Y":case"G":case"g":return Xe;case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return r?Qe:Pe;case"S":if(r)return Be;case"SS":if(r)return Re;case"SSS":if(r)return $e;case"DDD":return Ne;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return Ue;case"a":case"A":return I(e._l)._meridiemParse;case"X":return Ze;case"Z":case"ZZ":return je;case"T":return Ve;case"SSSS":return ze;case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return r?Re:Ge;case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return Ge;case"Do":return qe;default:return n=new RegExp($(R(t.replace("\\","")),"i"))}}function z(t){t=t||"";var e=t.match(je)||[],n=e[e.length-1]||[],r=(n+"").match(rn)||["-",0,0],a=+(60*r[1])+Y(r[2]);return"+"===r[0]?-a:a}function U(t,e,n){var r,a=n._a;switch(t){case"Q":null!=e&&(a[De]=3*(Y(e)-1));break;case"M":case"MM":null!=e&&(a[De]=Y(e)-1);break;case"MMM":case"MMMM":r=I(n._l).monthsParse(e),null!=r?a[De]=r:n._pf.invalidMonth=e;break;case"D":case"DD":null!=e&&(a[Ye]=Y(e));break;case"Do":null!=e&&(a[Ye]=Y(parseInt(e,10)));break;case"DDD":case"DDDD":null!=e&&(n._dayOfYear=Y(e));break;case"YY":a[Me]=pe.parseTwoDigitYear(e);break;case"YYYY":case"YYYYY":case"YYYYYY":a[Me]=Y(e);break;case"a":case"A":n._isPm=I(n._l).isPM(e);break;case"H":case"HH":case"h":case"hh":a[ke]=Y(e);break;case"m":case"mm":a[xe]=Y(e);break;case"s":case"ss":a[Te]=Y(e);break;case"S":case"SS":case"SSS":case"SSSS":a[Se]=Y(1e3*("0."+e));break;case"X":n._d=new Date(1e3*parseFloat(e));break;case"Z":case"ZZ":n._useUTC=!0,n._tzm=z(e);break;case"dd":case"ddd":case"dddd":r=I(n._l).weekdaysParse(e),null!=r?(n._w=n._w||{},n._w.d=r):n._pf.invalidWeekday=e;break;case"w":case"ww":case"W":case"WW":case"d":case"e":case"E":t=t.substr(0,1);case"gggg":case"GGGG":case"GGGGG":t=t.substr(0,2),e&&(n._w=n._w||{},n._w[t]=Y(e));break;case"gg":case"GG":n._w=n._w||{},n._w[t]=pe.parseTwoDigitYear(e)}}function j(t){var e,n,r,a,o,s,u,c;e=t._w,null!=e.GG||null!=e.W||null!=e.E?(o=1,s=4,n=i(e.GG,t._a[Me],ie(pe(),1,4).year),r=i(e.W,1),a=i(e.E,1)):(c=I(t._l),o=c._week.dow,s=c._week.doy,n=i(e.gg,t._a[Me],ie(pe(),o,s).year),r=i(e.w,1),null!=e.d?(a=e.d,o>a&&++r):a=null!=e.e?e.e+o:o),u=oe(n,r,a,s,o),t._a[Me]=u.year,t._dayOfYear=u.dayOfYear}function V(t){var e,n,r,a,o=[];if(!t._d){for(r=q(t),t._w&&null==t._a[Ye]&&null==t._a[De]&&j(t),t._dayOfYear&&(a=i(t._a[Me],r[Me]),t._dayOfYear>T(a)&&(t._pf._overflowDayOfYear=!0),n=ee(a,0,t._dayOfYear),t._a[De]=n.getUTCMonth(),t._a[Ye]=n.getUTCDate()),e=0;3>e&&null==t._a[e];++e)t._a[e]=o[e]=r[e];for(;7>e;e++)t._a[e]=o[e]=null==t._a[e]?2===e?1:0:t._a[e];t._d=(t._useUTC?ee:te).apply(null,o),null!=t._tzm&&t._d.setUTCMinutes(t._d.getUTCMinutes()+t._tzm)}}function Z(t){var e;t._d||(e=M(t._i),t._a=[e.year,e.month,e.day,e.hour,e.minute,e.second,e.millisecond],V(t))}function q(t){var e=new Date;return t._useUTC?[e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate()]:[e.getFullYear(),e.getMonth(),e.getDate()]}function B(t){if(t._f===pe.ISO_8601)return void Q(t);t._a=[],t._pf.empty=!0;var e,n,r,a,i,o=I(t._l),s=""+t._i,u=s.length,c=0;for(r=L(t._f,o).match(Ie)||[],e=0;e<r.length;e++)a=r[e],n=(s.match(P(a,t))||[])[0],n&&(i=s.substr(0,s.indexOf(n)),i.length>0&&t._pf.unusedInput.push(i),s=s.slice(s.indexOf(n)+n.length),c+=n.length),fn[a]?(n?t._pf.empty=!1:t._pf.unusedTokens.push(a),U(a,n,t)):t._strict&&!n&&t._pf.unusedTokens.push(a);t._pf.charsLeftOver=u-c,s.length>0&&t._pf.unusedInput.push(s),t._isPm&&t._a[ke]<12&&(t._a[ke]+=12),t._isPm===!1&&12===t._a[ke]&&(t._a[ke]=0),V(t),O(t)}function R(t){return t.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(t,e,n,r,a){return e||n||r||a})}function $(t){return t.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function J(t){var e,n,r,a,i;if(0===t._f.length)return t._pf.invalidFormat=!0,void(t._d=new Date(0/0));for(a=0;a<t._f.length;a++)i=0,e=h({},t),e._pf=o(),e._f=t._f[a],B(e),F(e)&&(i+=e._pf.charsLeftOver,i+=10*e._pf.unusedTokens.length,e._pf.score=i,(null==r||r>i)&&(r=i,n=e));h(t,n||e)}function Q(t){var e,n,r=t._i,a=Ke.exec(r);if(a){for(t._pf.iso=!0,e=0,n=en.length;n>e;e++)if(en[e][1].exec(r)){t._f=en[e][0]+(a[6]||" ");break}for(e=0,n=nn.length;n>e;e++)if(nn[e][1].exec(r)){t._f+=nn[e][0];break}r.match(je)&&(t._f+="Z"),B(t)}else t._isValid=!1}function X(t){Q(t),t._isValid===!1&&(delete t._isValid,pe.createFromInputFallback(t))}function K(t){var e=t._i,n=Ae.exec(e);e===a?t._d=new Date:n?t._d=new Date(+n[1]):"string"==typeof e?X(t):g(e)?(t._a=e.slice(0),V(t)):v(e)?t._d=new Date(+e):"object"==typeof e?Z(t):"number"==typeof e?t._d=new Date(e):pe.createFromInputFallback(t)}function te(t,e,n,r,a,i,o){var s=new Date(t,e,n,r,a,i,o);return 1970>t&&s.setFullYear(t),s}function ee(t){var e=new Date(Date.UTC.apply(null,arguments));return 1970>t&&e.setUTCFullYear(t),e}function ne(t,e){if("string"==typeof t)if(isNaN(t)){if(t=e.weekdaysParse(t),"number"!=typeof t)return null}else t=parseInt(t,10);return t}function re(t,e,n,r,a){return a.relativeTime(e||1,!!n,t,r)}function ae(t,e,n){var r=be(Math.abs(t)/1e3),a=be(r/60),i=be(a/60),o=be(i/24),s=be(o/365),u=r<cn.s&&["s",r]||1===a&&["m"]||a<cn.m&&["mm",a]||1===i&&["h"]||i<cn.h&&["hh",i]||1===o&&["d"]||o<=cn.dd&&["dd",o]||o<=cn.dm&&["M"]||o<cn.dy&&["MM",be(o/30)]||1===s&&["y"]||["yy",s];return u[2]=e,u[3]=t>0,u[4]=n,re.apply({},u)}function ie(t,e,n){var r,a=n-e,i=n-t.day();return i>a&&(i-=7),a-7>i&&(i+=7),r=pe(t).add("d",i),{week:Math.ceil(r.dayOfYear()/7),year:r.year()}}function oe(t,e,n,r,a){var i,o,s=ee(t,0,1).getUTCDay();return s=0===s?7:s,n=null!=n?n:a,i=a-s+(s>r?7:0)-(a>s?7:0),o=7*(e-1)+(n-a)+i+1,{year:o>0?t:t-1,dayOfYear:o>0?o:T(t-1)+o}}function se(t){var e=t._i,n=t._f;return null===e||n===a&&""===e?pe.invalid({nullInput:!0}):("string"==typeof e&&(t._i=e=I().preparse(e)),pe.isMoment(e)?(t=m(e),t._d=new Date(+e._d)):n?g(n)?J(t):B(t):K(t),new l(t))}function ue(t,e){var n,r;if(1===e.length&&g(e[0])&&(e=e[0]),!e.length)return pe();for(n=e[0],r=1;r<e.length;++r)e[r][t](n)&&(n=e[r]);return n}function ce(t,e){var n;return"string"==typeof e&&(e=t.lang().monthsParse(e),"number"!=typeof e)?t:(n=Math.min(t.date(),k(t.year(),e)),t._d["set"+(t._isUTC?"UTC":"")+"Month"](e,n),t)}function de(t,e){return t._d["get"+(t._isUTC?"UTC":"")+e]()}function le(t,e,n){return"Month"===e?ce(t,n):t._d["set"+(t._isUTC?"UTC":"")+e](n)}function fe(t,e){return function(n){return null!=n?(le(this,t,n),pe.updateOffset(this,e),this):de(this,t)}}function he(t){pe.duration.fn[t]=function(){return this._data[t]}}function me(t,e){pe.duration.fn["as"+t]=function(){return+this/e}}function ye(t){"undefined"==typeof ender&&(_e=we.moment,we.moment=t?s("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.",pe):pe)}for(var pe,_e,ge,ve="2.7.0",we="undefined"!=typeof r?r:this,be=Math.round,Me=0,De=1,Ye=2,ke=3,xe=4,Te=5,Se=6,Oe={},Fe={_isAMomentObject:null,_i:null,_f:null,_l:null,_strict:null,_tzm:null,_isUTC:null,_offset:null,_pf:null,_lang:null},Ce="undefined"!=typeof n&&n.exports,Ae=/^\/?Date\((\-?\d+)/i,We=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,Ee=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,Ie=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,He=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,Ge=/\d\d?/,Ne=/\d{1,3}/,Le=/\d{1,4}/,Pe=/[+\-]?\d{1,6}/,ze=/\d+/,Ue=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,je=/Z|[\+\-]\d\d:?\d\d/gi,Ve=/T/i,Ze=/[\+\-]?\d+(\.\d{1,3})?/,qe=/\d{1,2}/,Be=/\d/,Re=/\d\d/,$e=/\d{3}/,Je=/\d{4}/,Qe=/[+-]?\d{6}/,Xe=/[+-]?\d+/,Ke=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,tn="YYYY-MM-DDTHH:mm:ssZ",en=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],nn=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],rn=/([\+\-]|\d\d)/gi,an=("Date|Hours|Minutes|Seconds|Milliseconds".split("|"),{Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6}),on={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",Q:"quarter",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},sn={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},un={},cn={s:45,m:45,h:22,dd:25,dm:45,dy:345},dn="DDD w W M D d".split(" "),ln="M D H h m s w W".split(" "),fn={M:function(){return this.month()+1},MMM:function(t){return this.lang().monthsShort(this,t)},MMMM:function(t){return this.lang().months(this,t)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(t){return this.lang().weekdaysMin(this,t)},ddd:function(t){return this.lang().weekdaysShort(this,t)},dddd:function(t){return this.lang().weekdays(this,t)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return p(this.year()%100,2)},YYYY:function(){return p(this.year(),4)},YYYYY:function(){return p(this.year(),5)},YYYYYY:function(){var t=this.year(),e=t>=0?"+":"-";return e+p(Math.abs(t),6)},gg:function(){return p(this.weekYear()%100,2)},gggg:function(){return p(this.weekYear(),4)},ggggg:function(){return p(this.weekYear(),5)},GG:function(){return p(this.isoWeekYear()%100,2)},GGGG:function(){return p(this.isoWeekYear(),4)},GGGGG:function(){return p(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return Y(this.milliseconds()/100)},SS:function(){return p(Y(this.milliseconds()/10),2)},SSS:function(){return p(this.milliseconds(),3)},SSSS:function(){return p(this.milliseconds(),3)},Z:function(){var t=-this.zone(),e="+";return 0>t&&(t=-t,e="-"),e+p(Y(t/60),2)+":"+p(Y(t)%60,2)},ZZ:function(){var t=-this.zone(),e="+";return 0>t&&(t=-t,e="-"),e+p(Y(t/60),2)+p(Y(t)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},X:function(){return this.unix()},Q:function(){return this.quarter()}},hn=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"];dn.length;)ge=dn.pop(),fn[ge+"o"]=c(fn[ge],ge);for(;ln.length;)ge=ln.pop(),fn[ge+ge]=u(fn[ge],2);for(fn.DDDD=u(fn.DDD,3),h(d.prototype,{set:function(t){var e,n;for(n in t)e=t[n],"function"==typeof e?this[n]=e:this["_"+n]=e},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(t){return this._months[t.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(t){return this._monthsShort[t.month()]},monthsParse:function(t){var e,n,r;for(this._monthsParse||(this._monthsParse=[]),e=0;12>e;e++)if(this._monthsParse[e]||(n=pe.utc([2e3,e]),r="^"+this.months(n,"")+"|^"+this.monthsShort(n,""),this._monthsParse[e]=new RegExp(r.replace(".",""),"i")),this._monthsParse[e].test(t))return e},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(t){return this._weekdays[t.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(t){return this._weekdaysShort[t.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(t){return this._weekdaysMin[t.day()]},weekdaysParse:function(t){var e,n,r;for(this._weekdaysParse||(this._weekdaysParse=[]),e=0;7>e;e++)if(this._weekdaysParse[e]||(n=pe([2e3,1]).day(e),r="^"+this.weekdays(n,"")+"|^"+this.weekdaysShort(n,"")+"|^"+this.weekdaysMin(n,""),this._weekdaysParse[e]=new RegExp(r.replace(".",""),"i")),this._weekdaysParse[e].test(t))return e},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(t){var e=this._longDateFormat[t];return!e&&this._longDateFormat[t.toUpperCase()]&&(e=this._longDateFormat[t.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(t){return t.slice(1)}),this._longDateFormat[t]=e),e},isPM:function(t){return"p"===(t+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(t,e,n){return t>11?n?"pm":"PM":n?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(t,e){var n=this._calendar[t];return"function"==typeof n?n.apply(e):n},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(t,e,n,r){var a=this._relativeTime[n];return"function"==typeof a?a(t,e,n,r):a.replace(/%d/i,t)},pastFuture:function(t,e){var n=this._relativeTime[t>0?"future":"past"];return"function"==typeof n?n(e):n.replace(/%s/i,e)},ordinal:function(t){return this._ordinal.replace("%d",t)},_ordinal:"%d",preparse:function(t){return t},postformat:function(t){return t},week:function(t){return ie(t,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate}}),pe=function(t,e,n,r){var i;return"boolean"==typeof n&&(r=n,n=a),i={},i._isAMomentObject=!0,i._i=t,i._f=e,i._l=n,i._strict=r,i._isUTC=!1,i._pf=o(),se(i)},pe.suppressDeprecationWarnings=!1,pe.createFromInputFallback=s("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(t){t._d=new Date(t._i)}),pe.min=function(){var t=[].slice.call(arguments,0);return ue("isBefore",t)},pe.max=function(){var t=[].slice.call(arguments,0);return ue("isAfter",t)},pe.utc=function(t,e,n,r){var i;return"boolean"==typeof n&&(r=n,n=a),i={},i._isAMomentObject=!0,i._useUTC=!0,i._isUTC=!0,i._l=n,i._i=t,i._f=e,i._strict=r,i._pf=o(),se(i).utc()},pe.unix=function(t){return pe(1e3*t)},pe.duration=function(t,e){var n,r,a,i=t,o=null;return pe.isDuration(t)?i={ms:t._milliseconds,d:t._days,M:t._months}:"number"==typeof t?(i={},e?i[e]=t:i.milliseconds=t):(o=We.exec(t))?(n="-"===o[1]?-1:1,i={y:0,d:Y(o[Ye])*n,h:Y(o[ke])*n,m:Y(o[xe])*n,s:Y(o[Te])*n,ms:Y(o[Se])*n}):(o=Ee.exec(t))&&(n="-"===o[1]?-1:1,a=function(t){var e=t&&parseFloat(t.replace(",","."));return(isNaN(e)?0:e)*n},i={y:a(o[2]),M:a(o[3]),d:a(o[4]),h:a(o[5]),m:a(o[6]),s:a(o[7]),w:a(o[8])}),r=new f(i),pe.isDuration(t)&&t.hasOwnProperty("_lang")&&(r._lang=t._lang),r},pe.version=ve,pe.defaultFormat=tn,pe.ISO_8601=function(){},pe.momentProperties=Fe,pe.updateOffset=function(){},pe.relativeTimeThreshold=function(t,e){return cn[t]===a?!1:(cn[t]=e,!0)},pe.lang=function(t,e){var n;return t?(e?W(C(t),e):null===e?(E(t),t="en"):Oe[t]||I(t),n=pe.duration.fn._lang=pe.fn._lang=I(t),n._abbr):pe.fn._lang._abbr},pe.langData=function(t){return t&&t._lang&&t._lang._abbr&&(t=t._lang._abbr),I(t)},pe.isMoment=function(t){return t instanceof l||null!=t&&t.hasOwnProperty("_isAMomentObject")},pe.isDuration=function(t){return t instanceof f},ge=hn.length-1;ge>=0;--ge)D(hn[ge]);pe.normalizeUnits=function(t){return b(t)},pe.invalid=function(t){var e=pe.utc(0/0);return null!=t?h(e._pf,t):e._pf.userInvalidated=!0,e},pe.parseZone=function(){return pe.apply(null,arguments).parseZone()},pe.parseTwoDigitYear=function(t){return Y(t)+(Y(t)>68?1900:2e3)},h(pe.fn=l.prototype,{clone:function(){return pe(this)},valueOf:function(){return+this._d+6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.clone().lang("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var t=pe(this).utc();return 0<t.year()&&t.year()<=9999?N(t,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):N(t,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var t=this;return[t.year(),t.month(),t.date(),t.hours(),t.minutes(),t.seconds(),t.milliseconds()]},isValid:function(){return F(this)},isDSTShifted:function(){return this._a?this.isValid()&&w(this._a,(this._isUTC?pe.utc(this._a):pe(this._a)).toArray())>0:!1},parsingFlags:function(){return h({},this._pf)},invalidAt:function(){return this._pf.overflow},utc:function(){return this.zone(0)},local:function(){return this.zone(0),this._isUTC=!1,this},format:function(t){var e=N(this,t||pe.defaultFormat);return this.lang().postformat(e)},add:function(t,e){var n;return n="string"==typeof t&&"string"==typeof e?pe.duration(isNaN(+e)?+t:+e,isNaN(+e)?e:t):"string"==typeof t?pe.duration(+e,t):pe.duration(t,e),_(this,n,1),this},subtract:function(t,e){var n;return n="string"==typeof t&&"string"==typeof e?pe.duration(isNaN(+e)?+t:+e,isNaN(+e)?e:t):"string"==typeof t?pe.duration(+e,t):pe.duration(t,e),_(this,n,-1),this},diff:function(t,e,n){var r,a,i=A(t,this),o=6e4*(this.zone()-i.zone());return e=b(e),"year"===e||"month"===e?(r=432e5*(this.daysInMonth()+i.daysInMonth()),a=12*(this.year()-i.year())+(this.month()-i.month()),a+=(this-pe(this).startOf("month")-(i-pe(i).startOf("month")))/r,a-=6e4*(this.zone()-pe(this).startOf("month").zone()-(i.zone()-pe(i).startOf("month").zone()))/r,"year"===e&&(a/=12)):(r=this-i,a="second"===e?r/1e3:"minute"===e?r/6e4:"hour"===e?r/36e5:"day"===e?(r-o)/864e5:"week"===e?(r-o)/6048e5:r),n?a:y(a)},from:function(t,e){return pe.duration(this.diff(t)).lang(this.lang()._abbr).humanize(!e)},fromNow:function(t){return this.from(pe(),t)},calendar:function(t){var e=t||pe(),n=A(e,this).startOf("day"),r=this.diff(n,"days",!0),a=-6>r?"sameElse":-1>r?"lastWeek":0>r?"lastDay":1>r?"sameDay":2>r?"nextDay":7>r?"nextWeek":"sameElse";return this.format(this.lang().calendar(a,this))},isLeapYear:function(){return S(this.year())},isDST:function(){return this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone()},day:function(t){var e=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=t?(t=ne(t,this.lang()),this.add({d:t-e})):e},month:fe("Month",!0),startOf:function(t){switch(t=b(t)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===t?this.weekday(0):"isoWeek"===t&&this.isoWeekday(1),"quarter"===t&&this.month(3*Math.floor(this.month()/3)),this},endOf:function(t){return t=b(t),this.startOf(t).add("isoWeek"===t?"week":t,1).subtract("ms",1)},isAfter:function(t,e){return e="undefined"!=typeof e?e:"millisecond",+this.clone().startOf(e)>+pe(t).startOf(e)},isBefore:function(t,e){return e="undefined"!=typeof e?e:"millisecond",+this.clone().startOf(e)<+pe(t).startOf(e)},isSame:function(t,e){return e=e||"ms",+this.clone().startOf(e)===+A(t,this).startOf(e)},min:s("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(t){return t=pe.apply(null,arguments),this>t?this:t}),max:s("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(t){return t=pe.apply(null,arguments),t>this?this:t}),zone:function(t,e){var n=this._offset||0;return null==t?this._isUTC?n:this._d.getTimezoneOffset():("string"==typeof t&&(t=z(t)),Math.abs(t)<16&&(t=60*t),this._offset=t,this._isUTC=!0,n!==t&&(!e||this._changeInProgress?_(this,pe.duration(n-t,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,pe.updateOffset(this,!0),this._changeInProgress=null)),this)},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){return this._tzm?this.zone(this._tzm):"string"==typeof this._i&&this.zone(this._i),this},hasAlignedHourOffset:function(t){return t=t?pe(t).zone():0,(this.zone()-t)%60===0},daysInMonth:function(){return k(this.year(),this.month())},dayOfYear:function(t){var e=be((pe(this).startOf("day")-pe(this).startOf("year"))/864e5)+1;return null==t?e:this.add("d",t-e)},quarter:function(t){return null==t?Math.ceil((this.month()+1)/3):this.month(3*(t-1)+this.month()%3)},weekYear:function(t){var e=ie(this,this.lang()._week.dow,this.lang()._week.doy).year;return null==t?e:this.add("y",t-e)},isoWeekYear:function(t){var e=ie(this,1,4).year;return null==t?e:this.add("y",t-e)},week:function(t){var e=this.lang().week(this);return null==t?e:this.add("d",7*(t-e))},isoWeek:function(t){var e=ie(this,1,4).week;return null==t?e:this.add("d",7*(t-e))},weekday:function(t){var e=(this.day()+7-this.lang()._week.dow)%7;return null==t?e:this.add("d",t-e)},isoWeekday:function(t){return null==t?this.day()||7:this.day(this.day()%7?t:t-7)},isoWeeksInYear:function(){return x(this.year(),1,4)},weeksInYear:function(){var t=this._lang._week;return x(this.year(),t.dow,t.doy)},get:function(t){return t=b(t),this[t]()},set:function(t,e){return t=b(t),"function"==typeof this[t]&&this[t](e),this},lang:function(t){return t===a?this._lang:(this._lang=I(t),this)}}),pe.fn.millisecond=pe.fn.milliseconds=fe("Milliseconds",!1),pe.fn.second=pe.fn.seconds=fe("Seconds",!1),pe.fn.minute=pe.fn.minutes=fe("Minutes",!1),pe.fn.hour=pe.fn.hours=fe("Hours",!0),pe.fn.date=fe("Date",!0),pe.fn.dates=s("dates accessor is deprecated. Use date instead.",fe("Date",!0)),pe.fn.year=fe("FullYear",!0),pe.fn.years=s("years accessor is deprecated. Use year instead.",fe("FullYear",!0)),pe.fn.days=pe.fn.day,pe.fn.months=pe.fn.month,pe.fn.weeks=pe.fn.week,pe.fn.isoWeeks=pe.fn.isoWeek,pe.fn.quarters=pe.fn.quarter,pe.fn.toJSON=pe.fn.toISOString,h(pe.duration.fn=f.prototype,{_bubble:function(){var t,e,n,r,a=this._milliseconds,i=this._days,o=this._months,s=this._data;s.milliseconds=a%1e3,t=y(a/1e3),s.seconds=t%60,e=y(t/60),s.minutes=e%60,n=y(e/60),s.hours=n%24,i+=y(n/24),s.days=i%30,o+=y(i/30),s.months=o%12,r=y(o/12),s.years=r},weeks:function(){return y(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*Y(this._months/12)},humanize:function(t){var e=+this,n=ae(e,!t,this.lang());return t&&(n=this.lang().pastFuture(e,n)),this.lang().postformat(n)},add:function(t,e){var n=pe.duration(t,e);return this._milliseconds+=n._milliseconds,this._days+=n._days,this._months+=n._months,this._bubble(),this
},subtract:function(t,e){var n=pe.duration(t,e);return this._milliseconds-=n._milliseconds,this._days-=n._days,this._months-=n._months,this._bubble(),this},get:function(t){return t=b(t),this[t.toLowerCase()+"s"]()},as:function(t){return t=b(t),this["as"+t.charAt(0).toUpperCase()+t.slice(1)+"s"]()},lang:pe.fn.lang,toIsoString:function(){var t=Math.abs(this.years()),e=Math.abs(this.months()),n=Math.abs(this.days()),r=Math.abs(this.hours()),a=Math.abs(this.minutes()),i=Math.abs(this.seconds()+this.milliseconds()/1e3);return this.asSeconds()?(this.asSeconds()<0?"-":"")+"P"+(t?t+"Y":"")+(e?e+"M":"")+(n?n+"D":"")+(r||a||i?"T":"")+(r?r+"H":"")+(a?a+"M":"")+(i?i+"S":""):"P0D"}});for(ge in an)an.hasOwnProperty(ge)&&(me(ge,an[ge]),he(ge.toLowerCase()));me("Weeks",6048e5),pe.duration.fn.asMonths=function(){return(+this-31536e6*this.years())/2592e6+12*this.years()},pe.lang("en",{ordinal:function(t){var e=t%10,n=1===Y(t%100/10)?"th":1===e?"st":2===e?"nd":3===e?"rd":"th";return t+n}}),Ce?n.exports=pe:"function"==typeof t&&t.amd?(t("moment",function(t,e,n){return n.config&&n.config()&&n.config().noGlobal===!0&&(we.moment=_e),pe}),ye(!0)):ye()}).call(this)}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],12:[function(t,e){for(var n=t("performance-now"),r="undefined"==typeof window?{}:window,a=["moz","webkit"],i="AnimationFrame",o=r["request"+i],s=r["cancel"+i]||r["cancelRequest"+i],u=0;u<a.length&&!o;u++)o=r[a[u]+"Request"+i],s=r[a[u]+"Cancel"+i]||r[a[u]+"CancelRequest"+i];if(!o||!s){var c=0,d=0,l=[],f=1e3/60;o=function(t){if(0===l.length){var e=n(),r=Math.max(0,f-(e-c));c=r+e,setTimeout(function(){var t=l.slice(0);l.length=0;for(var e=0;e<t.length;e++)t[e].cancelled||t[e].callback(c)},r)}return l.push({handle:++d,callback:t,cancelled:!1}),d},s=function(t){for(var e=0;e<l.length;e++)l[e].handle===t&&(l[e].cancelled=!0)}}e.exports=function(){return o.apply(r,arguments)},e.exports.cancel=function(){s.apply(r,arguments)}},{"performance-now":13}],13:[function(t,e){(function(t){(function(){var n,r,a;"undefined"!=typeof performance&&null!==performance&&performance.now?e.exports=function(){return performance.now()}:"undefined"!=typeof t&&null!==t&&t.hrtime?(e.exports=function(){return(n()-a)/1e6},r=t.hrtime,n=function(){var t;return t=r(),1e9*t[0]+t[1]},a=n()):Date.now?(e.exports=function(){return Date.now()-a},a=Date.now()):(e.exports=function(){return(new Date).getTime()-a},a=(new Date).getTime())}).call(this)}).call(this,t("FWaASH"))},{FWaASH:1}],14:[function(t,e){"use strict";function n(t,e){var n=u[t.id];return n&&n[e.id]}function r(t,e){var n=u[t.id];n||(n=u[t.id]={});var r=i(e);n[e.id]=r,t.on("data",r),t.on("destroyed",a.bind(null,t,e))}function a(t,e){var n=u[t.id];if(n){var r=n[e.id];t.off("data",r),delete n[e.id]}}function i(t){return function(){t.refresh()}}function o(t,e){s(e.associated)||n(t,e)||r(t,e)}var s=t("./isInput"),u={};e.exports={add:o,remove:a}},{"./isInput":25}],15:[function(t,e){"use strict";function n(t){function e(e){return se=d(e||t,we),de||(de=o({className:se.styles.container})),fe=r,le=r,he=r,me=r,se.appendTo.appendChild(de),q(de),be=!1,ue=se.initialValue?se.initialValue:l.moment(),ce=ue.clone(),we.container=de,we.destroyed=!1,we.destroy=n.bind(we,!1),we.emitValues=j,we.getDate=ae,we.getDateString=ie,we.getMoment=oe,we.hide=O,we.options=p,we.options.reset=_,we.refresh=V,we.restore=m,we.setValue=Z,we.show=S,T(),y(),we.emit("ready",c(se)),we}function n(t){return de&&de.parentNode.removeChild(de),se&&y(!0),we.destroyed=!0,we.destroy=m,we.emitValues=m,we.getDate=m,we.getDateString=m,we.getMoment=m,we.hide=m,we.options=m,we.options.reset=m,we.refresh=m,we.restore=e,we.setValue=m,we.show=m,t!==!0&&we.emit("destroyed"),we.off(),we}function y(t){var e=t?"remove":"add";se.autoHideOnBlur&&h[e](document,"focusin",A),se.autoHideOnClick&&h[e](document,"click",W)}function p(t){return 0===arguments.length?c(se):(n(),e(t),we)}function _(){return p({})}function g(){be||(be=!0,v(),w(),we.emit("render"))}function v(){function t(t){var e=o({className:se.styles.month,parent:ye});0===t&&(pe=o({type:"button",className:se.styles.back,parent:e})),t===se.monthsInCalendar-1&&(_e=o({type:"button",className:se.styles.next,parent:e}));var n,r=o({className:se.styles.monthLabel,parent:e}),a=o({type:"table",className:se.styles.dayTable,parent:e}),i=o({type:"thead",className:se.styles.dayHead,parent:a}),s=o({type:"tr",className:se.styles.dayRow,parent:i}),u=o({type:"tbody",className:se.styles.dayBody,parent:a});for(n=0;Ye>n;n++)o({type:"th",className:se.styles.dayHeadElem,parent:s,text:De[b(n)]});u.setAttribute(Me,t),ke.push({label:r,body:u})}if(se.date){var e;for(ke=[],ye=o({className:se.styles.date,parent:de}),e=0;e<se.monthsInCalendar;e++)t(e);h.add(pe,"click",E),h.add(_e,"click",I),h.add(ye,"click",K)}}function w(){if(se.time&&se.timeInterval){var t=o({className:se.styles.time,parent:de});ge=o({className:se.styles.selectedTime,parent:t,text:ue.format(se.timeFormat)}),h.add(ge,"click",D),ve=o({className:se.styles.timeList,parent:t}),h.add(ve,"click",re);for(var e=l.moment("00:00:00","HH:mm:ss"),n=e.clone().add("days",1);e.isBefore(n);)o({className:se.styles.timeOption,parent:ve,text:e.format(se.timeFormat)}),e.add("seconds",se.timeInterval)}}function b(t,e){var n=e?-1:1,r=t+se.weekStart*n;return(r>=Ye||0>r)&&(r+=Ye*-n),r}function M(){if(se.time&&be){var t,e,n,r,a=ve.children,i=a.length;for(r=0;i>r;r++)n=a[r],e=l.moment(s(n),se.timeFormat),t=ne(ue.clone(),e),n.style.display=$(t,!1,se.timeValidator)?"block":"none"}}function D(t){var e="boolean"==typeof t?t:"none"===ve.style.display;e?Y():k()}function Y(){ve&&(ve.style.display="block")}function k(){ve&&(ve.style.display="none")}function x(){de.style.display="inline-block"}function T(){de.style.display="none"}function S(){return g(),V(),D(!se.date),x(),we}function O(){return k(),i(T),we}function F(){k();var t=f.contains(de,se.styles.positioned);return t&&i(T),we}function C(t){var e=t.target;if(e===we.associated)return!0;for(;e;){if(e===de)return!0;e=e.parentNode}}function A(t){C(t)||F()}function W(t){C(t)||F()}function E(){H("subtract")}function I(){H("add")}function H(t){var e,n="add"===t?-1:1,r=se.monthsInCalendar+n*ee(me);ce[t]("months",r),e=J(ce.clone()),ue=e||ue,e&&(ce=e.clone()),G()}function G(t){N(),U(),t!==!0&&j(),M()}function N(){function t(t,e){var n=ce.clone().add("months",e);s(t.label,n.format(se.monthFormat)),q(t.body)}if(se.date&&be){var e=ce.year(),n=ce.month(),r=ce.date();if(r!==he||n!==fe||e!==le){var a=P();if(he=ce.date(),fe=ce.month(),le=ce.year(),a)return void L();ke.forEach(t),B()}}}function L(){function t(t){var e,n=[];for(e=0;e<t.length;e++)n.push(t[e]);return n}function e(e){return t(e.children)}function n(t){return!f.contains(t,se.styles.dayPrevMonth)&&!f.contains(t,se.styles.dayNextMonth)}var r=ce.date()-1;te(!1),ke.forEach(function(a){var i;z(a.date,ce)&&(i=t(a.body.children).map(e),i=Array.prototype.concat.apply([],i).filter(n),te(i[r]))})}function P(){function t(t){return le?z(t.date,ce):!1}return ke.some(t)}function z(t,e){return t&&e&&t.year()===e.year()&&t.month()===e.month()}function U(){se.time&&be&&s(ge,ue.format(se.timeFormat))}function j(){return we.emit("data",ie()),we.emit("year",ue.year()),we.emit("month",ue.month()),we.emit("day",ue.day()),we.emit("time",ue.format(se.timeFormat)),we}function V(){le=!1,fe=!1,he=!1,G(!0)}function Z(t){var e=u(t,se.inputFormat);if(null!==e)return ue=J(e)||ue,ce=ue.clone(),G(!0),we}function q(t,e){for(;t&&t.firstChild;)t.removeChild(t.firstChild);e===!0&&t.parentNode.removeChild(t)}function B(){var t;for(t=0;t<se.monthsInCalendar;t++)R(t)}function R(t){function e(t){var e,r,a;for(e=0;e<t.length;e++)f.children.length===Ye&&(f=o({type:"tr",className:se.styles.dayRow,parent:i.body})),r=t.base.clone().add("days",e),a=o({type:"td",parent:f,text:r.format(se.dayFormat),className:n(r,t.cell.join(" ").split(" ")).join(" ")}),t.selectable&&r.date()===c&&te(a)}function n(t,e){return $(t,!0,se.dateValidator)||e.push(y),e}function r(t,e){return t&&e.push(se.styles.dayConcealed),e}var a,i=ke[t],s=ce.clone().add("months",t),u=s.daysInMonth(),c=s.month()!==ue.month()?-1:ue.date(),d=s.clone().date(1),l=b(d.day(),!0),f=o({type:"tr",className:se.styles.dayRow,parent:i.body}),h=r(0!==t,[se.styles.dayBodyElem,se.styles.dayPrevMonth]),m=r(t!==se.monthsInCalendar-1,[se.styles.dayBodyElem,se.styles.dayNextMonth]),y=se.styles.dayDisabled;e({base:d.clone().subtract("days",l),length:l,cell:h}),e({base:d.clone(),length:u,cell:[se.styles.dayBodyElem],selectable:!0}),a=d.clone().add("days",u),e({base:a,length:Ye-f.children.length,cell:m}),pe.disabled=!$(d,!0),_e.disabled=!$(a,!0),i.date=s.clone()}function $(t,e,n){var r=se.min?e?se.min.clone().startOf("day"):se.min:!1,a=se.max?e?se.max.clone().endOf("day"):se.max:!1;if(r&&t.isBefore(r))return!1;if(a&&t.isAfter(a))return!1;var i=(n||Function.prototype).call(we,t.toDate());return i!==!1}function J(t){if(se.min&&t.isBefore(se.min))return J(se.min.clone());if(se.max&&t.isAfter(se.max))return J(se.max.clone());var e=(t.daysInMonth(),t.clone().subtract("days",1));return X(e,t,"add")?Q(e):(e=t.clone(),X(e,t,"subtract")?Q(e):void 0)}function Q(t){var e,n=t.clone().subtract("seconds",se.timeInterval),r=Math.ceil(xe/se.timeInterval);for(e=0;r>e;e++)if(n.add("seconds",se.timeInterval),n.date()>t.date()&&n.subtract("days",1),se.timeValidator.call(we,n.toDate())!==!1)return n}function X(t,e,n){for(var r=!1;r===!1&&(t[n]("days",1),t.month()===e.month());)r=se.dateValidator.call(we,t.toDate());return r!==!1}function K(t){var e=t.target;if(!f.contains(e,se.styles.dayDisabled)&&f.contains(e,se.styles.dayBodyElem)){var n=parseInt(s(e),10),r=f.contains(e,se.styles.dayPrevMonth),a=f.contains(e,se.styles.dayNextMonth),i=ee(e)-ee(me);ue.add("months",i),(r||a)&&ue.add("months",r?-1:1),te(e),ue.date(n),ne(ue,J(ue)||ue),ce=ue.clone(),se.autoClose&&F(),G()}}function te(t){me&&f.remove(me,se.styles.selectedDay),t&&f.add(t,se.styles.selectedDay),me=t}function ee(t){for(var e;t&&t.getAttribute;){if(e=t.getAttribute(Me),"string"==typeof e)return parseInt(e,10);t=t.parentNode}return 0}function ne(t,e){return t.hour(e.hour()).minute(e.minute()).second(e.second()),t}function re(t){var e=t.target;if(f.contains(e,se.styles.timeOption)){var n=l.moment(s(e),se.timeFormat);ne(ue,n),ce=ue.clone(),j(),U(),!se.date&&se.autoClose?F():k()}}function ae(){return ue.toDate()}function ie(t){return ue.format(t||se.inputFormat)}function oe(){return ue.clone()}var se,ue,ce,de,le,fe,he,me,ye,pe,_e,ge,ve,we=a({}),be=!1,Me="data-rome-offset",De=l.moment.weekdaysMin(),Ye=De.length,ke=[],xe=86400;return n(!0),i(function(){e()}),we}var r,a=t("contra.emitter"),i=t("raf"),o=t("./dom"),s=t("./text"),u=t("./parse"),c=t("./clone"),d=t("./defaults"),l=t("./momentum"),f=t("./classes"),h=t("./events"),m=t("./noop");e.exports=n},{"./classes":16,"./clone":17,"./defaults":19,"./dom":20,"./events":21,"./momentum":26,"./noop":27,"./parse":28,"./text":40,"contra.emitter":2,raf:12}],16:[function(t,e){"use strict";function n(t){return t.className.replace(s,"").split(u)}function r(t,e){t.className=e.join(" ")}function a(t,e){var n=i(t,e);n.push(e),r(t,n)}function i(t,e){var a=n(t),i=a.indexOf(e);return-1!==i&&(a.splice(i,1),r(t,a)),a}function o(t,e){return-1!==n(t).indexOf(e)}var s=/^\s+|\s+$/g,u=/\s+/;e.exports={add:a,remove:i,contains:o}},{}],17:[function(t,e){"use strict";function n(t){var e,a={};for(var i in t)e=t[i],a[i]=e?r.isMoment(e)?e.clone():e._isStylesConfiguration?n(e):e:e;return a}var r=t("./momentum");e.exports=n},{"./momentum":26}],18:[function(t,e){"use strict";function n(t,e){var n,s=r.find(t);return s?s:(n=o(t)?a(t,e):i(t,e),n.associated=t,r.assign(t,n),n)}var r=t("./index"),a=t("./input"),i=t("./inline"),o=t("./isInput");e.exports=n},{"./index":22,"./inline":23,"./input":24,"./isInput":25}],19:[function(t,e){"use strict";function n(t,e){var n,i,o=t||{};if(o.autoHideOnClick===i&&(o.autoHideOnClick=!0),o.autoHideOnBlur===i&&(o.autoHideOnBlur=!0),o.autoClose===i&&(o.autoClose=!0),o.appendTo===i&&(o.appendTo=document.body),"parent"===o.appendTo){if(!a(e.associated))throw new Error("Inline calendars must be appended to a parent node explicitly.");o.appendTo=e.associated.parentNode}if(o.invalidate===i&&(o.invalidate=!0),o.required===i&&(o.required=!1),o.date===i&&(o.date=!0),o.time===i&&(o.time=!0),o.date===!1&&o.time===!1)throw new Error("At least one of `date` or `time` must be `true`.");if(o.inputFormat===i&&(o.inputFormat=o.date&&o.time?"YYYY-MM-DD HH:mm":o.date?"YYYY-MM-DD":"HH:mm"),o.initialValue=o.initialValue===i?null:r(o.initialValue,o.inputFormat),o.min=o.min===i?null:r(o.min,o.inputFormat),o.max=o.max===i?null:r(o.max,o.inputFormat),o.min&&o.max&&(o.max.isBefore(o.min)&&(n=o.max,o.max=o.min,o.min=n),o.max.clone().subtract("days",1).isBefore(o.min)))throw new Error("`max` must be at least one day after `min`");o.dateValidator===i&&(o.dateValidator=Function.prototype),o.timeValidator===i&&(o.timeValidator=Function.prototype),o.timeFormat===i&&(o.timeFormat="HH:mm"),o.timeInterval===i&&(o.timeInterval=1800),o.weekStart===i&&(o.weekStart=0),o.monthsInCalendar===i&&(o.monthsInCalendar=1),o.monthFormat===i&&(o.monthFormat="MMMM YYYY"),o.dayFormat===i&&(o.dayFormat="DD"),o.styles===i&&(o.styles={}),o.styles._isStylesConfiguration=!0;var s=o.styles;return s.back===i&&(s.back="rd-back"),s.container===i&&(s.container="rd-container"),s.positioned===i&&(s.positioned="rd-container-attachment"),s.date===i&&(s.date="rd-date"),s.dayBody===i&&(s.dayBody="rd-days-body"),s.dayBodyElem===i&&(s.dayBodyElem="rd-day-body"),s.dayPrevMonth===i&&(s.dayPrevMonth="rd-day-prev-month"),s.dayNextMonth===i&&(s.dayNextMonth="rd-day-next-month"),s.dayDisabled===i&&(s.dayDisabled="rd-day-disabled"),s.dayConcealed===i&&(s.dayConcealed="rd-day-concealed"),s.dayHead===i&&(s.dayHead="rd-days-head"),s.dayHeadElem===i&&(s.dayHeadElem="rd-day-head"),s.dayRow===i&&(s.dayRow="rd-days-row"),s.dayTable===i&&(s.dayTable="rd-days"),s.month===i&&(s.month="rd-month"),s.monthLabel===i&&(s.monthLabel="rd-month-label"),s.next===i&&(s.next="rd-next"),s.selectedDay===i&&(s.selectedDay="rd-day-selected"),s.selectedTime===i&&(s.selectedTime="rd-time-selected"),s.time===i&&(s.time="rd-time"),s.timeList===i&&(s.timeList="rd-time-list"),s.timeOption===i&&(s.timeOption="rd-time-option"),o}var r=t("./parse"),a=t("./isInput");e.exports=n},{"./isInput":25,"./parse":28}],20:[function(t,e){"use strict";function n(t){var e=t||{};e.type||(e.type="div");var n=document.createElement(e.type);return e.className&&(n.className=e.className),e.text&&(n.innerText=n.textContent=e.text),e.parent&&e.parent.appendChild(n),n}e.exports=n},{}],21:[function(t,e){function n(t,e,n){return t.addEventListener(e,n)}function r(t,e,n){return t.attachEvent("on"+e,function(e){var e=e||window.event;e.target=e.target||e.srcElement,e.preventDefault=e.preventDefault||function(){e.returnValue=!1},e.stopPropagation=e.stopPropagation||function(){e.cancelBubble=!0},n.call(t,e)})}function a(t,e,n){return t.removeEventListener(e,n)}function i(t,e,n){return t.detachEvent("on"+e,n)}var o=n,s=a;window.addEventListener||(o=r),window.removeEventListener||(s=i),e.exports={add:o,remove:s}},{}],22:[function(t,e){"use strict";function n(t){if("number"!=typeof t&&t&&t.getAttribute)return n(t.getAttribute(i));var e=o[t];return e!==a?e:null}function r(t,e){t.setAttribute(i,e.id=o.push(e)-1)}var a,i="data-rome-id",o=[];e.exports={find:n,assign:r}},{}],23:[function(t,e){"use strict";function n(t,e){function n(){r(o.show)}var i=e||{};i.appendTo=t;var o=a(i).on("ready",n);return o}var r=t("raf"),a=t("./calendar");e.exports=n},{"./calendar":15,raf:12}],24:[function(t,e){"use strict";function n(t,e){function n(e){M=i(e),u.add(k.container,M.styles.positioned),c.add(k.container,"mousedown",m),c.add(k.container,"click",h),k.getDate=b(k.getDate),k.getDateString=b(k.getDateString),k.getMoment=b(k.getMoment),M.initialValue&&(t.value=M.initialValue.format(M.inputFormat)),k.on("data",v),f(),x()}function d(){f(!0),a(l)}function l(){k.once("ready",n),k.once("destroyed",d)}function f(e){var n=e?"remove":"add";c[n](t,"click",p),c[n](t,"touchend",p),c[n](t,"focusin",p),c[n](t,"change",x),c[n](t,"keypress",x),c[n](t,"keydown",x),c[n](t,"input",x),M.invalidate&&c[n](t,"blur",y),c[n](window,"resize",T)}function h(){Y=!0,t.focus(),Y=!1}function m(){function t(){D=!1}D=!0,a(t)}function y(){D||w()||k.emitValues()}function p(){Y||(k.show(),_())}function _(){var e=t.getBoundingClientRect(),n=document.body.scrollTop||document.documentElement.scrollTop;k.container.style.top=e.top+n+t.offsetHeight+"px",k.container.style.left=e.left+"px"}function g(){var e=t.value.trim();if(!w()){var n=s.moment(e,M.inputFormat);k.setValue(n)}}function v(e){t.value=e}function w(){return M.required===!1&&""===t.value.trim()}function b(t){return function(){return w()?null:t.apply(this,arguments)}}var M,D,Y,k=o(e),x=r(g,50),T=r(_,30);return l(),k}var r=t("lodash.throttle"),a=t("raf"),i=t("./clone"),o=t("./calendar"),s=t("./momentum"),u=t("./classes"),c=t("./events");e.exports=n},{"./calendar":15,"./classes":16,"./clone":17,"./events":21,"./momentum":26,"lodash.throttle":4,raf:12}],25:[function(t,e){"use strict";function n(t){return t&&t.nodeName&&"input"===t.nodeName.toLowerCase()}e.exports=n},{}],26:[function(t,e){"use strict";function n(t){return t&&Object.prototype.hasOwnProperty.call(t,"_isAMomentObject")}var r={moment:null,isMoment:n};e.exports=r},{}],27:[function(t,e){"use strict";function n(){}e.exports=n},{}],28:[function(t,e){"use strict";function n(t,e){return"string"==typeof t?a.moment(t,e):"[object Date]"===Object.prototype.toString.call(t)?a.moment(t):a.isMoment(t)?t.clone():void 0}function r(t,e){var r=n(t,"string"==typeof e?e:null);return r&&r.isValid()?r:null}var a=t("./momentum");e.exports=r},{"./momentum":26}],29:[function(){Array.prototype.every||(Array.prototype.every=function(t,e){var n,r;if(null==this)throw new TypeError("this is null or not defined");var a=Object(this),i=a.length>>>0;if("function"!=typeof t)throw new TypeError(t+" is not a function");for(arguments.length>1&&(n=e),r=0;i>r;){if(r in a){var o=t.call(n,a[r],r,a);if(!o)return!1}r++}return!0})},{}],30:[function(){Array.prototype.filter||(Array.prototype.filter=function(t,e){var n=[];return this.forEach(function(r,a,i){t.call(e,r,a,i)&&n.push(r)},e),n})},{}],31:[function(){Array.prototype.forEach||(Array.prototype.forEach=function(t,e){if(void 0===this||null===this||"function"!=typeof t)throw new TypeError;for(var n=this,r=n.length,a=0;r>a;a++)a in n&&t.call(e,n[a],a,n)})},{}],32:[function(){Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){if(void 0===this||null===this)throw new TypeError;var n=this.length;for(e=+e||0,1/0===Math.abs(e)?e=0:0>e&&(e+=n,0>e&&(e=0));n>e;e++)if(this[e]===t)return e;return-1})},{}],33:[function(){Array.isArray||(Array.isArray=function(t){return""+t!==t&&"[object Array]"===Object.prototype.toString.call(t)})},{}],34:[function(){Array.prototype.map||(Array.prototype.map=function(t,e){var n,r,a;if(null==this)throw new TypeError("this is null or not defined");var i=Object(this),o=i.length>>>0;if("function"!=typeof t)throw new TypeError(t+" is not a function");for(arguments.length>1&&(n=e),r=new Array(o),a=0;o>a;)a in i&&(r[a]=t.call(n,i[a],a,i)),a++;return r})},{}],35:[function(){Array.prototype.some||(Array.prototype.some=function(t,e){var n,r;if(null==this)throw new TypeError("this is null or not defined");var a=Object(this),i=a.length>>>0;if("function"!=typeof t)throw new TypeError(t+" is not a function");for(arguments.length>1&&(n=e),r=0;i>r;){if(r in a){var o=t.call(n,a[r],r,a);if(o)return!0}r++}return!1})},{}],36:[function(){Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var e=Array.prototype.slice.call(arguments,1),n=this,r=function(){},a=function(){var a=this instanceof r&&t?this:t,i=e.concat(Array.prototype.slice.call(arguments));return n.apply(a,i)};return r.prototype=this.prototype,a.prototype=new r,a})},{}],37:[function(){String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")})},{}],38:[function(t,e){"use strict";t("./polyfills/function.bind"),t("./polyfills/array.foreach"),t("./polyfills/array.map"),t("./polyfills/array.filter"),t("./polyfills/array.isarray"),t("./polyfills/array.indexof"),t("./polyfills/array.every"),t("./polyfills/array.some"),t("./polyfills/string.trim");var n=t("./core"),r=t("./index"),a=t("./use");n.use=a.bind(n),n.find=r.find,n.val=t("./validators"),e.exports=n},{"./core":18,"./index":22,"./polyfills/array.every":29,"./polyfills/array.filter":30,"./polyfills/array.foreach":31,"./polyfills/array.indexof":32,"./polyfills/array.isarray":33,"./polyfills/array.map":34,"./polyfills/array.some":35,"./polyfills/function.bind":36,"./polyfills/string.trim":37,"./use":41,"./validators":42}],39:[function(t,e){"use strict";var n=t("moment"),r=t("./rome");r.use(n),e.exports=r},{"./rome":38,moment:11}],40:[function(t,e){"use strict";function n(t,e){return 2===arguments.length&&(t.innerText=t.textContent=e),t.innerText||t.textContent}e.exports=n},{}],41:[function(t,e){"use strict";function n(t){this.moment=r.moment=t}var r=t("./momentum");e.exports=n},{"./momentum":26}],42:[function(t,e){"use strict";function n(t){return function(e){var n=i(e);return function(r){var s=a.find(e),u=i(r),c=n||s&&s.getMoment();return c?(s&&o.add(this,s),t(u,c)):!0}}}function r(t,e){return function(n,r){function s(t){var e,n,r=a.find(t);return r?e=n=r.getMoment():Array.isArray(t)?(e=t[0],n=t[1]):e=n=t,r&&o.add(r,this),{start:i(e).startOf("day").toDate(),end:i(n).endOf("day").toDate()}}var u,c=arguments.length;return Array.isArray(n)?u=n:1===c?u=[n]:2===c&&(u=[[n,r]]),function(n){return u.map(s.bind(this))[t](e.bind(this,n))}}}var a=t("./index"),i=t("./parse"),o=t("./association"),s=n(function(t,e){return t>=e}),u=n(function(t,e){return t>e}),c=n(function(t,e){return e>=t}),d=n(function(t,e){return e>t}),l=r("every",function(t,e){return e.start>t||e.end<t}),f=r("some",function(t,e){return e.start<=t&&e.end>=t});e.exports={afterEq:s,after:u,beforeEq:c,before:d,except:l,only:f}},{"./association":14,"./index":22,"./parse":28}]},{},[39])(39)});
