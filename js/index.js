function NodeList2Array(NodeList) {
  return [].slice.call(NodeList);
};

window.onload = function() {

  // load io
  io.fromJSONString(savedFile);

  // render app
  React.renderComponent(<App editor={editor} io={io} pixel={canvas.pixel} signal={signal}/>, document.body);

  // setup zoom
  signal.zoomChanged.dispatch(editor.zoom);

  // select top-most layer
  var topLayer = _.max(io.layers, function(layer) { return layer.z; });
  console.log('selecting top layer: ', topLayer.id);
  signal.layerSelected.dispatch(topLayer.id);

  // select brush tool
  signal.toolSelected.dispatch('BrushTool');


  // draw loaded file to stage
  canvas.frame.refresh();
  // update layer previews
  io.layers.forEach(function(layer){
    signal.layerContentChanged.dispatch(layer.id);
  })
};