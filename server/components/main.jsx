/** @jsx React.DOM */
var React = require('react');
var Classable = require('./mixins/classable.js');
var WindowListenable = require('./mixins/window-listenable.js');
var KeyCode = require('./utils/key-code.js');
var Calendar = require('./calendar.jsx');
var TextField = require('./text-field.jsx');
var Icon = require('./icon.jsx');
var TimeHelper = require('./time-helper.jsx');
var testparse = require('date.js');
var moment = require('moment');
var request = require('request');
var test_date = testparse('in 5 hours');

console.log('test 5 hrs', test_date);

var clickCount = 0,
singleClickTimer;

if(typeof(window) !== 'undefined') {
var loadJSONP = (function loadJSONP_outer( window, document, undefined ) { var uuid, head, main_script
    uuid = 0
    head = document.head || document.getElementsByTagName( 'head' )[0]
    main_script = document.createElement( 'script' )
    main_script.type = 'text/javascript'

    return function loadJSONP_inner( url, callback, context ) { var name, script
      // INIT
      name = '__jsonp_' + uuid++
      if ( url.match(/\?/) )
        url += '&callback=' + name
      else
        url += '?callback=' + name

      // Create script
      script = main_script.cloneNode()
      script.src = url

      // Setup handler
      window[name] = function( data ) {
        callback.call( ( context || window ), data )
        head.removeChild( script )
        script = null
        delete window[name]
      }

      // Load JSON
      head.appendChild( script );
    }
  })( window, document );

  function __jsonp_0(data) {
      console.log('callback ran');
      console.log(data);
      /* Todo for RAMA - the trigger attribute is what will fire the function */
      console.log(data.trigger);
      window[data.trigger]('test');
      console.log('callback end');
      // window[settings.functionName](t.parentNode.id);
  }

  function run_cleanup(string){
   console.log('triggered from CB');
   console.log(string);
   document.getElementById('remind-me').innerText = 'AwesomeSauce Reminder Saved!';

   setTimeout(function() {
      console.log('close window');
      window.close();
   }, 1000);
  }

}

var placeHolderHelpers = ["10 minutes from now",
     "in 3 hours",
     "at 12:30pm",
     "tomorrow night at 5",
     "in 2 days",
     "sunday night",
     "next week wednesday",
     "in 2 months",
     "friday at 2pm",
     "next week saturday morning",
     "next week tuesday at 4:30pm"
];

var Main = React.createClass({

  mixins: [Classable, WindowListenable],

  propTypes: {
    initialDate: React.PropTypes.object,
    onAccept: React.PropTypes.func
  },

  windowListeners: {
    'keyup': '_handleWindowKeyUp'
  },
  /* Get url param */
  getURLParameter: function(name) {
      if( typeof document !== "undefined") {
        var get = decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
        var returnVal = (get === "null") ? "" : get;
         return returnVal;
      } else {
         return "";
      }

  },
  fixedEncodeURI: function (str) {
      return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
  },

  /*
   * Throttle function borrowed from:
   * Underscore.js 1.5.2
   * http://underscorejs.org
   * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Underscore may be freely distributed under the MIT license.
   */
  throttle: function (func, wait) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  },
  formatAMPM: function (date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  },
  getInitialState: function() {
    var init = new Date();
    GLOBAL_TOD = this.formatAMPM(init),
    rand = placeHolderHelpers[Math.floor(Math.random() * placeHolderHelpers.length)];


    return {
      isCalendarActive: true,
      globaltime: init,
      time_of_day: GLOBAL_TOD,
      url: decodeURIComponent(this.getURLParameter('url')),
      title: decodeURIComponent(this.getURLParameter('title')),
      description: decodeURIComponent(this.getURLParameter('description')),
      api: this.getURLParameter('api'),
      humanHint: rand,
      humanInputActive: true,
      saved: false
    };
  },
  parseDate: function(e){
      var fromHumanDate = false;
      console.log(e.target.value);
      if(e.target.value.match(/\bTime selected from calendar\b/)) {
        console.log("placeholder here return FALSE");
        return false;
      }

      if (e.target.className.match(/\bfromcal\b/)) {
        console.log('value from Calendar Click');
      }
      if (e.target.id === "human_date") {
        console.log('value from Human date');
        fromHumanDate = true;
      }
      var time = testparse(e.target.value);

      var month_num = moment(time).startOf('month')._d; // Number

      //var nur = parseInt(e.target.value, 10);
      /* this works. need to debounce */
      //this.refs.calendar._addSelectedDays(nur);
      var d = new Date(month_num);

      var time_of_day = moment(time).format('h:mm A');
      console.log('TOD', time_of_day)

      var test = this.refs.calendar._setDisplayDate(d, time, 'parser');
      console.log('return', test);
      this.refs.calendar._setTime(time_of_day);
      if(fromHumanDate && test) {
        this.setState({
            globaltime: test
        });
      }
  },
  clearHumanInput: function(time){
        var rand = placeHolderHelpers[Math.floor(Math.random() * placeHolderHelpers.length)];
        this.refs.human_date.setValue('Time selected from calendar');
        this.setState({
            humanInputActive: false,
            humanHint: rand
        });
  },
  setGlobalTime: function(time){
        console.log('jdhjksdhfks', this.state.time_of_day)
        var theTime = this.mergeTODandDate(time, this.state.time_of_day);
        console.log('gloabl time', theTime);
        this.setState({
            globaltime: theTime
        });
  },
  mergeTODandDate: function(time, tod){
      var TOD = tod.split(":");
      var splitTwo = TOD[1].split(" ");
      var ampm = splitTwo[1].toLowerCase();
      var m = moment(time);
      var milTime = this.convertToMilitaryTime(ampm, TOD[0], splitTwo[0]);
      var newTime = m._d;
      m.set('hour', milTime.hours);
      m.set('minute', milTime.minutes);
      console.log("Merge Time", newTime);
      return newTime;
  },
  setGlobalTOD: function(tod){
      var time = this.state.globaltime;
      console.log('SET Global TOD here', tod);
      var theTime = this.mergeTODandDate(time, tod);
      console.log('setting merge time', theTime);
      this.setState({
            time_of_day: tod,
            globaltime: theTime
      });
  },
  convertToMilitaryTime: function ( ampm, hours, minutes ) {
      var militaryHours;
      if( ampm == "am" ) {
          militaryHours = hours;
          // check for special case: midnight
          if( militaryHours == "12" ) { militaryHours = "00"; }
      } else {
          if( ampm == "pm" || am == "p.m." ) {
              // get the interger value of hours, then add
              tempHours = parseInt( hours ) + 2;
              // adding the numbers as strings converts to strings
              if( tempHours < 10 ) tempHours = "1" + tempHours;
              else tempHours = "2" + ( tempHours - 10 );
              // check for special case: noon
              if( tempHours == "24" ) { tempHours = "12"; }
              militaryHours = tempHours;
          }
      }
      return { hours: militaryHours, minutes: minutes };
  },
  updateText: function(label){
      this.refs.human_date.setValue(label);

      var time = testparse(label);
      var month_num = moment(time).startOf('month')._d; // Number
      var d = new Date(month_num);
      var time_of_day = moment(time).format('h:mm A');

      var newTime = this.refs.calendar._setDisplayDate(d, time, 'click-helper');
      this.refs.calendar._setTime(time_of_day);
      if(newTime) {
        this.setState({
            globaltime: newTime
        });
      }
  },
  _handleTitleChange: function(e) {
    this.setState({
      title: e.target.value
    });
  },
  _handleUrlChange: function(e) {
    this.setState({
      url: e.target.value
    });
  },
  updateTextArea: function(e) {
    this.setState({
      description: e.target.value
    });
  },

  _handle_parse: function(e){
      console.log('run parse');
      this.throttle(this.parseDate, 100);
  },
  helperFunc: function(e){
      console.log('click on helper func');
      var target = e.target;
      var mouseMove = function() {
        console.log('drag click');
        target.removeEventListener('mousemove', mouseMove);
        clear();
      },
      clear = function() {
        clickCount = 0;
        clearTimeout(singleClickTimer);
      };

      clickCount++;

      // Single Click
      if(clickCount === 1) {
        target.addEventListener('mousemove', mouseMove);

        singleClickTimer = setTimeout(function() {
          console.log('single click');
          clickCount = 0;
        }, 400);

      // Double Click
      } else if (clickCount === 2) {
        console.log('double click');
        var box = document.getElementById('suggestions');

        clear();
        setTimeout(function() {
              box.style.display = "block";
        }, 300);

        console.log('show box');
      }
  },
  showHelper: function(){
      var box = document.getElementById('suggestions');

      console.log('run show/hide ->' + box.style.display);
      if( box.style.display === "block" || box.style.display === "") {
         box.style.display = "none";
       } else {
          console.log('make box block')
         box.style.display = "block";
       }

  },
  saveReminder:  function (url, callback) {
        console.log("onclick Event detected!");

        var time = this.state.globaltime;

        if(!time) {
           var time = new Date();
        }

        var title = this.state.title;
        var msg = this.state.description;
        var url =  this.state.url;
        var that = this;
        //var api_key = document.getElementById('api').textContent;
        var api_key =  this.state.api;
        console.log(api_key);
              if (window.location.href.toLowerCase().indexOf("localhost")>-1) {
                  console.log('localhost');
                  var base_url = "http://localhost:3001/";
              } else {
                  var base_url = "http://thislater.com/";
                  console.log('live');
              }
      var ping = base_url + "api/reminder/create?title="+title+"&url="+url+"&msg="+msg+"&time="+ time+"&api="+api_key+"&callback=func_callbk";
      console.log(ping);
        request.post(
              base_url + "api/reminder/create",
              {
                json: {
                          title: title,
                          url: url,
                          msg: msg,
                          time: time,
                          api: api_key
                      }
              },
              function (error, response, body) {
                console.log('success', response.body);
                 that.setState({saved: true});
                  document.getElementById('remind-me').innerHTML = 'AwesomeSauce Reminder Saved!';
              }
            );
  },

  render: function() {
    var saveReminder = !this.state.saved ? this.saveReminder : null;
    //var toggleParseDate = !this.state.humanInputActive ? this.parseDate  : null;
    var m = moment(this.state.globaltime); // Number
    var formated = m.format("dddd, MMMM Do YYYY, h:mm a");

    console.log("saveReminder", this.state.saved);
    console.log('MASTER TIME being saved ->>>', this.state.globaltime);

    var {
      initialDate,
      onAccept,
      ...other
    } = this.props;
    var classes = this.getClasses('mui-date-picker-dialog');

    return (
      <div id="calendar-wrapper">

        <div id="controls">
          <div id="branding">Inbound Now<span className="logo-icon"></span></div>
          <TextField value={this.state.title} id="title"
            onChange={this._handleTitleChange}
            hintText="Title"
            floatingLabelText="Enter the title of your reminder" />
          <TextField value={this.state.url} id="url"
            onChange={this._handleUrlChange}

              hintText="http://theURLtoRember.com"
              floatingLabelText="URL" />
          <div id="human_input_area">

           <TextField onChange={this.parseDate} onMouseDown={this.helperFunc} ref="human_date" id="human_date"
              hintText={this.state.humanHint}
              floatingLabelText="When do you want to be reminded?" />
            <Icon id="action-help" icon="action-help" onClick={this.showHelper} />
            <div className="formattedTime"><strong>Currently selected:</strong> {formated}</div>
            <TimeHelper update={this.updateText} />
          </div>

          <span id="description-label">Description</span>
          <textarea id="description" rows="3" onChange={this.updateTextArea} value={this.state.description} ></textarea>

         {/* https://github.com/code42day/clock or http://codepen.io/ElmahdiMahmoud/pen/Injdq*/}
        </div>
        <Calendar
          resetHumanInput={this.clearHumanInput}
          setGlobal ={this.setGlobalTime}
          setGlobalTOD_3 = {this.setGlobalTOD}
          ref="calendar"
          initialDate={this.props.initialDate}
          isActive={this.state.isCalendarActive} />

          <div id="remind-me" onClick={saveReminder}><span id="buttonlogo"></span>Remind Me</div>
          <input type="hidden" id="chromelandingpage"  />

      </div>
    );
  },

  show: function() {
    this.refs.dialogWindow.show();
  },

  dismiss: function() {
    this.refs.dialogWindow.dismiss();
  },

  _handleCancelTouchTap: function() {
    this.dismiss();
  },

  _handleOKTouchTap: function() {
    this.dismiss();
    if (this.props.onAccept) {
      this.props.onAccept(this.refs.calendar.getSelectedDate());
    }
  },

  _handleDialogShow: function() {
    this.setState({
      isCalendarActive: true
    });
  },

  _handleDialogDismiss: function() {
    this.setState({
      isCalendarActive: false
    });
  },

  _handleWindowKeyUp: function(e) {

    if (e.target.id !== "time-selected" && e.target.id !== "human_date") {
      console.log('keyup from main');
      switch (e.keyCode) {
        case KeyCode.ENTER:
          this._handleOKTouchTap();
          break;
      }
    }
  }

});

module.exports = Main;