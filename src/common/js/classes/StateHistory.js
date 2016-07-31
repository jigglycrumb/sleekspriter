var StateHistory = function() {
  this.last = {
    action: null,
    payload: null,
    pixels: [], // saves pixels for undo
  };

  this.undoPointer = 0;
};

StateHistory.prototype.constructor = StateHistory;

StateHistory.prototype.addUndoState = function(dictionary) {
  this.last.pixels.push(dictionary);
};

StateHistory.prototype.undo = function() {

};

StateHistory.prototype.redo = function() {

};

module.exports = new StateHistory();
