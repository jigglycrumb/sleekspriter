function NodeList2Array(NodeList) {
  //return [ ... NodeList ]; // ES6 version, doesn't work with JSX compiler
  return [].slice.call(NodeList);
};

function capitaliseFirstLetter(string) { // used in the brightness tool
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function inArray(array, value) {
  return array.indexOf(value) > -1;
}

function fitCanvasIntoSquareContainer(canvasWidth, canvasHeight, containerSize) {
  var w = canvasWidth,
      h = canvasHeight,
      style = {},
      scale;

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

  // load file
  file.fromJSONString(savedFile);

  // init auto palette
  editor.buildAutoPalette();

  // render app
  React.renderComponent(<App editor={editor} file={file} pixel={stage.pixel} signal={signal}/>, document.body);


  // draw all pixels to layers
  file.pixels.forEach(function(px) {
    stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
  });

  // select each frame once to initialize previews etc
  var totalFrames = file.frames.x * file.frames.y;
  for(var i = 1; i <= totalFrames; i++) {
    signal.frameSelected.dispatch(i);
  }

  // select the first frame again
  signal.frameSelected.dispatch(1);

  // select top-most layer
  editor.selectTopLayer();

  // setup zoom
  signal.zoomChanged.dispatch(editor.zoom);


  // select brush tool
  signal.toolSelected.dispatch('BrushTool');
};