/** @jsx React.DOM */
var React = require('react');
var Classable = require('./mixins/classable.js');
var WindowListenable = require('./mixins/window-listenable.js');
var KeyCode = require('./utils/key-code.js');
var Calendar = require('./calendar.jsx');
var TextField = require('./text-field.jsx');

var events = require('events');
var eventEmitter = new events.EventEmitter();


var hours;
/** @type {null} */
var min = null;
/** @type {boolean} */
var isAm = false;

function removeClass(classSelector){
   var removeClickedClass = document.querySelector('.' + classSelector);
   if (removeClickedClass) {
        removeClickedClass.className = removeClickedClass.className.replace(" " + classSelector, "");
   }
}

function toggleActive(target) {
    removeClass('hour-clicked');
    target.className += ' hour-clicked'; //add class
    highLightAMPM(target);
}

function toggleSecActive(target) {
   removeClass('second-clicked');
   target.className += ' second-clicked'; //add class
}

function highLightAMPM(target){

    removeClass('ampm-clicked');

    if (target.className.match(/\bpm\b/)) {
      document.getElementById('timePMFormat').className += ' ampm-clicked';
    } else if (target.className.match(/\bam\b/)) {
      document.getElementById('timeAMFormat').className += ' ampm-clicked';
    }
    console.log('trigegred');
}

function addHrsListener(e){
      hours = e.target.innerHTML;
      toggleActive(e.target)
      setDate();
}
function addMinsListener(e){
      min = e.target.innerHTML;
      toggleSecActive(e.target);
      setDate();
}

function addAmsListener(e){
    isAm = true;
    setDate();
    return false;
}

function addPmsListener(e){
    isAm = false;
    setDate();
}

function timepicker(opt_id) {
  console.log('init timepice')
    /** @type {(HTMLElement|null)} */
    var testNode = document.getElementById(opt_id);
    /** @type {Element} */
    var table = document.createElement("table");
    /** @type {Element} */
    var tbody = document.createElement("tbody");
    /** @type {Element} */
    var row = document.createElement("tr");
    /** @type {Element} */
    var th = document.createElement("th");
    /** @type {Element} */
    var header = document.createElement("th");
    th.appendChild(document.createTextNode("Hours"));
    th.setAttribute("colspan", "5");
    header.appendChild(document.createTextNode("Minutes"));
    header.setAttribute("colspan", "4");
    row.appendChild(th);
    row.appendChild(header);
    var td;
    var node;
    var cell;
    var label;
    var newValue;
    var s;
    var ln;
    tbody.appendChild(row);
    /** @type {number} */
    var count = 0;
    for (; count < 6; count++) {
        /** @type {Element} */
        row = document.createElement("tr");
        if (count === 0 || count === 3) {
            /** @type {Element} */
            td = document.createElement("td");
            if (count === 0) {
                /** @type {string} */
                label = "AM";
                /** @type {string} */
                newValue = "hrs am";
                td.setAttribute("class", "am am-tall ampm-selector");
                td.id = 'timeAMFormat';
            } else {
                /** @type {string} */
                label = "PM";
                /** @type {string} */
                newValue = "hrs pm";
                td.setAttribute("class", "pm pm-tall ampm-selector");
                td.id = 'timePMFormat';
            }
            td.appendChild(document.createTextNode(label));
            td.setAttribute("rowspan", "3");

            row.appendChild(td);
        }
        /** @type {number} */
        var pm = 1;
        for (; pm <= 4; pm++) {
            if (count < 3) {
                /** @type {number} */
                ln = count;
            } else {
                /** @type {number} */
                ln = count - 3;
            }
            /** @type {number} */
            s = ln * 4 + pm;
            if (s < 10) {
                /** @type {string} */
                s = "0" + s;
            }
            /** @type {Element} */
            node = document.createElement("td");
            node.appendChild(document.createTextNode(s));
            node.setAttribute("class", newValue);
            node.setAttribute("data-time", label);
            node.id = label + "-" + s;
            row.appendChild(node);
        }
        if (count === 0 || (count == 2 || count == 4)) {
            /** @type {number} */
            var diameter = 0;
            for (; diameter < 4; diameter++) {
                /** @type {number} */
                s = 5 * diameter + count * 10;
                if (s < 10) {
                    /** @type {string} */
                    s = "0" + s;
                }
                /** @type {Element} */
                cell = document.createElement("td");
                cell.appendChild(document.createTextNode(s));
                cell.setAttribute("class", "minutes");
                cell.setAttribute("rowspan", "2");
                row.appendChild(cell);
            }
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    testNode.appendChild(table);
    table.setAttribute("class", "timepicker");
    table.id = "time-table";
}

function clickedOutsideElement(elemId) {
  var theElem = getEventTarget(window.event);
  while(theElem != null) {
    if(theElem.id == elemId)
      return false;
    theElem = theElem.offsetParent;
  }
  return true;
}

function getEventTarget(evt) {
  var targ = (evt.target) ? evt.target : evt.srcElement;
  if(targ != null) {
    if(targ.nodeType == 3)
      targ = targ.parentNode;
  }
  return targ;
}



function _hideTheTable(e){
       var table = document.getElementById('time-table');
       if(clickedOutsideElement('time-table')) {
           table.style.display = "none";
       } else {
          //alert('Inside the element!');
       }
}

if(typeof(window) !== 'undefined') {

  setTimeout(function() {
      timepicker("timepicker");
  }, 500);

  setTimeout(function() {
         var hrs = document.querySelectorAll(".hrs");
         console.log('add hours listenr')
         for (var i = hrs.length - 1; i >= 0; i--) {
           hrs[i].addEventListener("click", addHrsListener, false);
         };

         var mins = document.querySelectorAll(".minutes");
           for (var i = mins.length - 1; i >= 0; i--) {
           mins[i].addEventListener("click", addMinsListener, false);
         };

          var ams = document.querySelectorAll(".am");
           for (var i = ams.length - 1; i >= 0; i--) {
           ams[i].addEventListener("click", addAmsListener, false);
         };

          var pms = document.querySelectorAll(".pm");
         for (var i = pms.length - 1; i >= 0; i--) {
           pms[i].addEventListener("click", addPmsListener, false);
         };

         var ampms = document.querySelectorAll('.ampm-selector');
         for (var i = ampms.length - 1; i >= 0; i--) {
           ampms[i].addEventListener("click", amPmToggle, false);
         };

         var table = document.body;
         table.addEventListener("click", _hideTheTable);

  }, 800);

}



function trim(s) {
            s = s.replace(/(^\s*)|(\s*$)/gi, "");
            s = s.replace(/[ ]{2,}/gi, " ");
            s = s.replace(/\n /, "\n");
            s = s.replace(/\.+$/, "");
            return s;
}

function toggleClassSwitch(hours, s) {
    console.log(trim(s) + '-' + hours);
    var id_1 = trim(s) + '-' + hours;
    var new_item = document.getElementById(id_1);
    if(new_item) {
        removeClass('hour-clicked');
        new_item.className += ' hour-clicked'; //add class
    }

}

function amPmToggle(e){
     if (isAm) {
        /** @type {string} */
        s = " AM";
    } else {
        /** @type {string} */
        s = " PM";
    }
    hours = hours;
    toggleClassSwitch(hours, s);
    console.log(e.target);
    highLightAMPM(e.target);
}
/**
 * @return {undefined}
 */
function setDate() {
    var s;
    var setTime;
    var timeInput = document.getElementById('time-selected');
    if (isAm) {
        /** @type {string} */
        s = " AM";
    } else {
        /** @type {string} */
        s = " PM";
    }
    if (hours) {
        if (min) {
          setTime = hours + ":" + min + s;

        } else {
            setTime = hours + ":00" + s;
        }
        // set classes here
    } else {
        if (min) {
             setTime  = "00:" + min + s;
        } else {
             setTime  = "00:00" + s;
        }
    }
    //timeInput.value = setTime;
    eventEmitter.emit('UpdateTime', setTime);
}
/*
$(document).on("click", "div.timepicker input", function(event) {
    event.stopPropagation();
    $(this).parent().find("table.timepicker").show();
});
$(document).on("click", function() {
    $("table.timepicker").hide();
});
*/
var GLOBAL_COUNT = false;
var TimePicker = React.createClass({

   _handleclick: function(e) {
      e.stopPropagation();
      var table = document.getElementById('time-table');
      table.style.display = "block";
  },
  _validateNumbers: function(time){

  },
  _handleOnChange: function(e){
      var validate = e.target.value.split(":");
      var minutes = '00';
      var am_pm = 'am';
      var hours = (typeof validate[0] !== "undefined") ? validate[0] : '00';
      hours = (parseInt(hours, 10) > 12 ) ? 12 : hours;

      if(typeof validate[1] !== "undefined") {
        var second_val = validate[1].split(" ");
        var minutes = (typeof second_val[0] !== "undefined") ? second_val[0] : '00';
        minutes = (parseInt(minutes, 10) > 60 ) ? 59 : minutes;
        var am_pm = (typeof second_val[1] !== "undefined") ? second_val[1] : 'am';
        var validate = am_pm.toLowerCase();
        console.log(validate);

        if( validate.indexOf("pam") > -1 || validate.indexOf("amp") > -1 ) {
          am_pm = 'PM';
        } else if (validate.indexOf("apm") > -1 || validate.indexOf("pma") > -1 ) {
          am_pm = 'AM';
        } else if (validate.indexOf("am") > -1 ) {
          am_pm = 'AM';
        } else {
          am_pm = 'PM';
        }

        if (minutes < 10 && minutes !== "00") {
          //console.log('not valid');
          //minute = "0" + minutes;
          //console.log(minute);
          //return false;
        }
        //console.log('padded', minutes);
      }
      /*
      if(typeof validate[1] !== "undefined"){
        var val_2 = validate[1].split(" ");
        console.log('val_2', val_2[0]);
        var minutes = val_2[0];
        if(typeof minutes === "undefined"){
          console.log('no val');
          minutes = "00";
        } else {
          minutes = (parseInt(minutes, 10) > 60 ) ? 59 : minutes;
        }
        console.log("Minute", minutes);
        var am_pm = val_2[1];
        if(typeof am_pm === "undefined"){
          console.log('no val');
          am_pm = "AM";
        } else {
          var test = am_pm.toLowerCase();
          console.log("TEST", test);
          if (am_pm.toLowerCase().match(/\bpm\b/)) {
            am_pm = "PM";
          } else if (am_pm.toLowerCase().match(/\bam\b/)) {
            am_pm = "AM";
          } else {

            am_pm = "AM";
          }
        }
      } else {

        minutes = "00";
        am_pm = "AM";
      } */
      var final_val = hours + ":" + minutes + " " + am_pm;
      console.log('Final time', final_val);
      this.props.clearHumanTime_1();
      this.ClockHandler(final_val);

  },
  ClockHandler: function (time, context){
      console.log('set the state', time);
      this.setState({timepicker: time });
      this.props.setGlobalTOD_1(time);
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
    var date = new Date();
    var current = this.formatAMPM(date);
    console.log('curreeeennt',current);
    return {
      timepicker: current
    };
  },
  componentDidMount: function(){
    eventEmitter.on('UpdateTime', this.ClockHandler);
    console.log(this.state);
    setTimeout(function() {
       console.log('hey there');
        console.log(this.state);
        }, 1000);
  },

  render: function() {

    return (
      <div id="timepicker-wrapper">
        <div id="timepicker" className="timepicker span2 w-90 outer-lft-10">
            <input id="time-selected" onChange={this._handleOnChange} onClick={this._handleclick} className="w-90-perc" type="text" value={this.state.timepicker} />
        </div>
      </div>
    );
  },


});

module.exports = TimePicker;