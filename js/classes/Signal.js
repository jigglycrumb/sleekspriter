var Signal = signals.Signal;
var signal = {

  file: {
    layerAdded: new Signal(),
    layerRemoved: new Signal(),
  },

  frameContentChanged: new Signal(),

  layerAdded: new Signal(),
  layerRemoved: new Signal(),
  layerContentChanged: new Signal(),

  pixelSelected: new Signal(),
  pixelFilled: new Signal(),
  pixelCleared: new Signal(),

  pixelsMoved: new Signal(),
  bucketUsed: new Signal(),
};
/*
var oldFn = signals.prototype.dispatch;
signals.prototype.dispatch = function() {
  console.log(arguments);
  oldFn.call(this);
}
*/