function NodeList2Array(NodeList) {
  return [].slice.call(NodeList);
};

function fitCanvasIntoSquareContainer(canvasWidth, canvasHeight, containerSize) {
  var w = canvasWidth,
      h = canvasHeight,
      style = {};

  if(w > h) {
    scale = containerSize/w;
    style.marginTop = Math.floor((containerSize - Math.round(h*scale))/2);
  }
  else {
    scale = containerSize/h;
    style.marginLeft = Math.floor((containerSize - Math.round(w*scale))/2);
  }

  w = Math.round(w*scale);
  h = Math.round(h*scale);

  style.width = w;
  style.height = h;

  return style;
}

window.onload = function() {

  // load io
  io.fromJSONString(savedFile);

  // render app
  React.renderComponent(<App editor={editor} io={io} pixel={stage.pixel} signal={signal}/>, document.body);

  // draw all frames once to stage to initialize offscreen area
  var totalFrames = io.frames.x * io.frames.y;
  for(var i = 1; i <= totalFrames; i++) {
    signal.frameSelected.dispatch(i);
    //editor.frame = i;
    stage.frame.refresh(i);
  }

  // select the first frame again
  signal.frameSelected.dispatch(1);

  // setup zoom
  signal.zoomChanged.dispatch(editor.zoom);

  // select top-most layer
  var topLayer = _.max(io.layers, function(layer) { return layer.z; });
  console.log('selecting top layer: ', topLayer.id);
  signal.layerSelected.dispatch(topLayer.id);

  // select brush tool
  signal.toolSelected.dispatch('BrushTool');
};