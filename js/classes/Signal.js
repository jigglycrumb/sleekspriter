var Signal = signals.Signal;
var signal = {

  file: {
    layerAdded: new Signal(),
    layerRemoved: new Signal(),
  },


  frameContentChanged: new Signal(),


  layerAdded: new Signal(),
  layerRemoved: new Signal(),
  layerSelected: new Signal(),
  layerContentChanged: new Signal(),
  layerOpacityChanged: new Signal(),
  layerVisibilityChanged: new Signal(),
  layerNameChanged: new Signal(),

  pixelSelected: new Signal(),
  pixelFilled: new Signal(),
  pixelCleared: new Signal(),

  brightnessToolModeChanged: new Signal(),
  brightnessToolIntensityChanged: new Signal(),

  selectionStarted: new Signal(),
  selectionEnded: new Signal(),
  selectionMoved: new Signal(),
  selectionCleared: new Signal(),
  selectionResized: new Signal(),
  selectionUpdated: new Signal(),
  selectionPixelsMoved: new Signal(),

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