var ResetStateMixin = {
  resetState: function() {
    this.setState(this.getInitialState());
  },
};