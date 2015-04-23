var React = require('react');
var Classable = require('./mixins/classable.js');
var DateTime = require('./utils/date-time.js');
var TimePicker = require('./timepicker.jsx');
var SlideInTransitionGroup = require('./transition-groups/slide-in.jsx');

var DateDisplay = React.createClass({

  mixins: [Classable],

  propTypes: {
    selectedDate: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      transitionDirection: 'up'
    };
  },

  _settime: function(time_of_day){
    console.log('test ref in display_date');
    this.refs.time_picker.ClockHandler(time_of_day);
  },

  componentWillReceiveProps: function(nextProps) {
    var direction;

    if (nextProps.selectedDate !== this.props.selectedDate) {
      direction = nextProps.selectedDate > this.props.selectedDate ? 'up' : 'down';
      this.setState({
        transitionDirection: direction
      });
    }
  },
  setGlobalTOD: function(time){
    console.log('dd', time);
    this.props.setGlobalTOD_2(time);
  },

  clearHumanTime: function(){
    this.props.clearHumanTime_2();
  },

  render: function() {
    var {
      selectedDate,
      ...other
    } = this.props;
    var classes = this.getClasses('mui-date-picker-date-display');
    var dayOfWeek = DateTime.getDayOfWeek(this.props.selectedDate);
    var month = DateTime.getShortMonth(this.props.selectedDate);
    var day = this.props.selectedDate.getDate();
    var year = this.props.selectedDate.getFullYear();

    return (
      <div {...other} className={classes}>

        <SlideInTransitionGroup
          className="mui-date-picker-date-display-dow"
          direction={this.state.transitionDirection}>
          <div key={dayOfWeek}>{dayOfWeek}</div>
        </SlideInTransitionGroup>

        <div className="mui-date-picker-date-display-date">

          <SlideInTransitionGroup
            id="month-text"
            className="mui-date-picker-date-display-month"
            direction={this.state.transitionDirection}>
            <div key={month}>{month}</div>
          </SlideInTransitionGroup>

          <SlideInTransitionGroup
            id="day-text"
            className="mui-date-picker-date-display-day"
            direction={this.state.transitionDirection}>
            <div key={day}>{day}</div>
          </SlideInTransitionGroup>

          <SlideInTransitionGroup
            id="year-text"
            className="mui-date-picker-date-display-year"
            direction={this.state.transitionDirection}>
            <div key={year}>{year}</div>
          </SlideInTransitionGroup>

           <TimePicker
            clearHumanTime_1={this.clearHumanTime}
            setGlobalTOD_1={this.setGlobalTOD} ref="time_picker" />
        </div>

      </div>
    );
  }

});

module.exports = DateDisplay;