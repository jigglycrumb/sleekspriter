var StateHistory = function() {
  this.last = {
    action: null,
    payload: null,
  };
};

StateHistory.prototype.constructor = StateHistory;

module.exports = new StateHistory();
