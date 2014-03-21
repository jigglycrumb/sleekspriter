var Signal = signals.Signal;
var signal = {

  frameSelected: new Signal(),
  frameContentChanged: new Signal(),

  toolSelected: new Signal(),

  colorSelected: new Signal(),

  layerOpacityChanged: new Signal(),
  layerVisibilityChanged: new Signal(),
  layerNameChanged: new Signal(),
  layerSelected: new Signal(),
  layerAddedToIO: new Signal(),
  layerRemovedFromIO: new Signal(),
  layerAdded: new Signal(),
  layerRemoved: new Signal(),
  layerContentChanged: new Signal(),


  pixelSelected: new Signal(),
  pixelFilled: new Signal(),
  pixelCleared: new Signal(),


  zoomChanged: new Signal(),
  gridToggled: new Signal()
};