var StateHistory = function() {
  this.lastAction = null;
};

StateHistory.prototype.constructor = StateHistory;

StateHistory.prototype.setLastAction = function(action) {
  this.lastAction = action;
};