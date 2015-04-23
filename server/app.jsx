(function() {

    var React = require('react/addons'),
        injectTapEventPlugin = require("react-tap-event-plugin");

    //Needed for onTouchTap
    //Can go away when react 1.0 release
    //Check this repo:
    //https://github.com/zilverline/react-tap-event-plugin
    injectTapEventPlugin();

    var App = require('./components/main.jsx');

    //Needed for React Developer Tools
    window.React = React;

    var mountNode = document.getElementById("react-main-mount");

    React.render(new App({}), mountNode);

})();
