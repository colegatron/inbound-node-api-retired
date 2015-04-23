var React = require('react');

var formats = [{
        "label": "10 minutes from now",
        "cursor": 2
    }, {
        "label": "in 3 hours",
        "cursor": 4
    }, {
        "label": "at 12:30pm",
        "cursor": 8
    }, {
        "label": "tomorrow night at 5",
        "cursor": 99
    }, {
        "label": "in 2 days",
        "cursor": 4
    }, {
        "label": "sunday night",
        "cursor": 6
    }, {
        "label": "next week wednesday",
        "cursor": 99
    }, {
        "label": "in 2 months",
        "cursor": 4
    }, {
        "label": "friday at 2pm",
        "cursor": 11
    }, {
        "label": "next week saturday morning",
        "cursor": 18
    }, {
        "label": "last month",
        "cursor": 99
    }, {
      "label" : "next week tuesday at 4:30pm",
      "cursor" : 10
    }
];

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



function _hideTheHelper(e){
       var table = document.getElementById('suggestions');
       if(clickedOutsideElement('suggestions')) {
           table.style.display = "none";
       } else {
          //alert('Inside the element!');
       }
}

var TimeHelper = React.createClass({

  hideHelper: function(){
      var box = document.getElementById('suggestions');
      box.style.display = "none";
  },
  setCaretPosition: function (ctrl, pos) {

    if(ctrl.setSelectionRange){
      ctrl.focus();
      ctrl.setSelectionRange(pos,pos);
    } else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  },
  handleClick: function(_this, item){
      console.log(_this.label);
      var input = document.getElementById('human_date');
      //input.value = _this.label;
      console.log('clicked');
      this.props.update(_this.label);
      this.setCaretPosition(input,_this.cursor);
      this.hideHelper();
  },
  componentDidMount: function(){
     var table = document.body;
         table.addEventListener("click", _hideTheHelper);
  },

  render: function() {
    var _this = this;
    var items = function (item, index) {
      var id = item.label.toLowerCase().replace(/ /g, "_");
      return (
        <li key={ index } id={id} onClick={ _this.handleClick.bind(_this, item) } >
            { item.label }
        </li>
      );
    };
    return (
      <div id="suggestions" className="suggestions">
      <span className="hint"><b>Hint:</b> you can use these time formats to schedule reminders</span>

      <div id="close-sugg" onClick={this.hideHelper}>✖</div>
        <ul className="clear">
              { formats.map(items) }
       </ul>
      </div>
    );
  }

});

module.exports = TimeHelper;