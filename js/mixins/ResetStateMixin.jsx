/** @jsx React.DOM */
var ResetStateMixin = {
  resetState: function() {
    this.setState(this.getInitialState());
  },
};