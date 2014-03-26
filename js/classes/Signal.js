var Signal = signals.Signal;
var signal = {

  file: {
    layerAdded: new Signal(),
    layerRemoved: new Signal(),

    pixelFilled: new Signal(),
    pixelCleared: new Signal(),
  },

  frameSelected: new Signal(),
  frameContentChanged: new Signal(),

  toolSelected: new Signal(),

  colorSelected: new Signal(),

  layerAdded: new Signal(),
  layerRemoved: new Signal(),
  layerSelected: new Signal(),
  layerContentChanged: new Signal(),
  layerOpacityChanged: new Signal(),
  layerVisibilityChanged: new Signal(),
  layerNameChanged: new Signal(),

  pixelSelected: new Signal(),

  zoomChanged: new Signal(),
  gridToggled: new Signal()
};
/*
var oldFn = signals.prototype.dispatch;
signals.prototype.dispatch = function() {
  console.log(arguments);
  oldFn.call(this);
}
*/