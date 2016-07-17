var StateHistory = function() {
  this.last = {
    action: null,
    payload: null,
    pixels: [], // saves pixels for undo
  };
};

StateHistory.prototype.constructor = StateHistory;

StateHistory.prototype.addUndoState = function() {

};

module.exports = new StateHistory();
