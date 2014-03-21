function NodeList2Array(NodeList) {
  return [].slice.call(NodeList);
};

window.onload = function() {

  // load io
  io.fromJSONString(savedFile);

  // render app
  React.renderComponent(<App editor={editor} io={io} pixel={canvas.pixel} signal={signal}/>, document.body);

  // draw all frames once to stage to initialize offscreen area
  var totalFrames = io.frames.x * io.frames.y;
  for(var i = 1; i <= totalFrames; i++) {
    signal.frameSelected.dispatch(i);
    //editor.frame = i;
    canvas.frame.refresh(i);
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