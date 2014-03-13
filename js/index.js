function NodeList2Array(NodeList) {
  return [].slice.call(NodeList);
};

function drawFromIO() {
  io.pixels.forEach(function(px) {
    editor.layer = px.layer;
    editor.pixel = {x: px.x, y: px.y};
    editor.color = Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')');
    pixel.fill();
  });
  signal.pixelSelected.dispatch(0, 0);
}

window.onload = function() {

  // load io
  io.fromJSONString(savedFile);


  React.renderComponent(<App editor={editor} io={io} pixel={pixel} signal={signal}/>, document.body);

  drawFromIO();

  // setup zoom
  signal.zoomChanged.dispatch(editor.zoom);

  // select top-most layer
  var topLayer = _.max(io.layers, function(layer) { return layer.z; });
  signal.layerSelected.dispatch(topLayer.id);

  // select brush tool
  signal.toolSelected.dispatch('BrushTool');
};