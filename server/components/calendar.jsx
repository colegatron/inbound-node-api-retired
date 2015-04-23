/** @jsx React.DOM */
var React = require('react');
var Classable = require('./mixins/classable.js');
var WindowListenable = require('./mixins/window-listenable.js');
var DateTime = require('./utils/date-time.js');
var KeyCode = require('./utils/key-code.js');
var CalendarMonth = require('./calendar-month.jsx');
var CalendarToolbar = require('./calendar-toolbar.jsx');
var DateDisplay = require('./date-display.jsx'); /* contains timpicker */
var SlideInTransitionGroup = require('./transition-groups/slide-in.jsx');


var Calendar = React.createClass({

  mixins: [Classable, WindowListenable],

  propTypes: {
    initialDate: React.PropTypes.object,
    isActive: React.PropTypes.bool
  },

  windowListeners: {
    'keydown': '_handleWindowKeyDown'
  },

  getDefaultProps: function() {
    return {
      initialDate: new Date()
    };
  },

  getInitialState: function() {
    return {
      displayDate: DateTime.getFirstDayOfMonth(this.props.initialDate),
      selectedDate: this.props.initialDate,
      transitionDirection: 'left'
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.initialDate !== this.props.initialDate) {
      var d = nextProps.initialDate || new Date();
      this.setState({
        displayDate: DateTime.getFirstDayOfMonth(d),
        selectedDate: d
      });
    }
  },

  render: function() {
    var weekCount = DateTime.getWeekArray(this.state.displayDate).length;
    var classes = this.getClasses('mui-date-picker-calendar', {
      'mui-is-4week': weekCount === 4,
      'mui-is-5week': weekCount === 5,
      'mui-is-6week': weekCount === 6
    });

    return (
      <div className={classes}>

        <DateDisplay
          clearHumanTime_2={this.clearHumanTime}
          setGlobalTOD_2={this.setGlobalTOD}
          ref="display_date"
          className="mui-date-picker-calendar-date-display"
          selectedDate={this.state.selectedDate} />

        <div
          className="mui-date-picker-calendar-container">
          <CalendarToolbar
            displayDate={this.state.displayDate}
            onLeftTouchTap={this._handleLeftTouchTap}
            onRightTouchTap={this._handleRightTouchTap} />

          <ul className="mui-date-picker-calendar-week-title">
            <li className="mui-date-picker-calendar-week-title-day">S</li>
            <li className="mui-date-picker-calendar-week-title-day">M</li>
            <li className="mui-date-picker-calendar-week-title-day">T</li>
            <li className="mui-date-picker-calendar-week-title-day">W</li>
            <li className="mui-date-picker-calendar-week-title-day">T</li>
            <li className="mui-date-picker-calendar-week-title-day">F</li>
            <li className="mui-date-picker-calendar-week-title-day">S</li>
          </ul>

          <SlideInTransitionGroup
            direction={this.state.transitionDirection}>
            <CalendarMonth
              key={this.state.displayDate.toDateString()}
              displayDate={this.state.displayDate}
              onDayTouchTap={this._handleDayTouchTap}
              selectedDate={this.state.selectedDate} />
          </SlideInTransitionGroup>
        </div>
      </div>
    );
  },

  getSelectedDate: function() {
    return this.state.selectedDate;
  },

  _addDisplayDate: function(m) {
    console.log('new date set');
    var newDisplayDate = DateTime.clone(this.state.displayDate);
    newDisplayDate.setMonth(newDisplayDate.getMonth() + m);
    this._setDisplayDate(newDisplayDate);
  },

  _addSelectedDays: function(days) {
    console.log('Update days', days);
    this._setSelectedDate(DateTime.addDays(this.state.selectedDate, days));
  },

  _addSelectedMonths: function(months) {
    this._setSelectedDate(DateTime.addMonths(this.state.selectedDate, months));
  },

  _setTime: function(time_of_day){
      this.refs.display_date._settime(time_of_day);
  },
  setGlobalTOD: function(tod){
      console.log('cc', tod);
      this.props.setGlobalTOD_3(tod);
  },
  clearHumanTime: function(){
    console.log('running clear human time');
    this.props.resetHumanInput();
  },
  _setDisplayDate: function(d, newSelectedDate, context) {
    var context = context || "calendar-click";
    console.log('context', context);
    console.log('TEST d', d);
    console.log("New seletced date", newSelectedDate);
    console.log('clicked on cal clear human date');
    var newDisplayDate = DateTime.getFirstDayOfMonth(d);
    var direction = newDisplayDate > this.state.displayDate ? 'left' : 'right';



    if (newDisplayDate !== this.state.displayDate) {
      this.setState({
        displayDate: newDisplayDate,
        transitionDirection: direction,
        selectedDate: newSelectedDate || this.state.selectedDate
      });
    }
    console.log('props', this.props);
    this.props.setGlobal(newSelectedDate);

    if(context === "calendar-click") {
      // reset human text field
        this.props.resetHumanInput();
    }

    return newSelectedDate;
  },

  _setSelectedDate: function(d) {
    var newDisplayDate = DateTime.getFirstDayOfMonth(d);

    if (newDisplayDate !== this.state.displayDate) {
      this._setDisplayDate(newDisplayDate, d);
    } else {
      this.setState({
        selectedDate: d
      });
    }
  },

  _handleDayTouchTap: function(e, date) {
    this._setSelectedDate(date);
  },

  _handleLeftTouchTap: function() {
    this._addDisplayDate(-1);
  },

  _handleRightTouchTap: function() {
    this._addDisplayDate(1);
  },

  _handleWindowKeyDown: function(e) {
    var newSelectedDate;
    var test = e.target.id !== "time-selected" && e.target.id !== "human_date";
    if (this.props.isActive && test) {

      switch (e.keyCode) {

        case KeyCode.UP:
          if (e.shiftKey) {
            this._addSelectedMonths(-1);
          } else {
            this._addSelectedDays(-7);
          }
          break;

        case KeyCode.DOWN:
          if (e.shiftKey) {
            this._addSelectedMonths(1);
          } else {
            this._addSelectedDays(7);
          }
          break;

        case KeyCode.RIGHT:
          if (e.shiftKey) {
            this._addSelectedMonths(1);
          } else {
            this._addSelectedDays(1);
          }
          break;

        case KeyCode.LEFT:
          if (e.shiftKey) {
            this._addSelectedMonths(-1);
          } else {
            this._addSelectedDays(-1);
          }
          break;

      }

    }
  }

});

module.exports = Calendar;