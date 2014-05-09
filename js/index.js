function NodeList2Array(NodeList) {
  //return [ ... NodeList ]; // ES6 version, doesn't work with JSX compiler
  return [].slice.call(NodeList);
};

function capitaliseFirstLetter(string) { // used in the brightness tool
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function inArray(array, value) {
  return array.indexOf(value) > -1;
};

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
};

function wrapPixel(pixel, distance) {
  var targetX = pixel.x + distance.x,
      targetY = pixel.y + distance.y;

  if(targetX > file.size.width) targetX -= file.size.width;
  else if(targetX < 1) targetX += file.size.width;
  if(targetY > file.size.height) targetY -= file.size.height;
  else if(targetY < 1) targetY += file.size.height;

  return new Point(targetX, targetY);
};

function isLayerVisible() {
  var layer = file.getLayerById(editor.layer);
  return layer.visible && layer.opacity > 0;
};

// fix for color.js darken/lighten functions
// uses absolute instead of relative strengths and works on black/white
function changeColorLightness(color, delta) {
  var newColor = new Color(color.rgb()),
      l = newColor.hsl().l;

  l+= delta;
  newColor.values.hsl[2] = l;
  newColor.setValues("hsl", newColor.values.hsl);
  return newColor;
};

function minutely() {
  console.log('running minutely job');
  //editor.saveChanges();
  workspace.save();
};



// move this into window.onload later
var file = new File();
var stage = new Stage();
var editor = new Editor(signal);
var hotkeys = new Hotkeys(signal, editor);

var workspace = new Workspace();

window.onbeforeunload = workspace.save;

window.onload = function() {

  workspace.load();

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
  var totalFrames = file.frames.x * file.frames.y,
      frame = editor.frame;
  for(var i = 1; i <= totalFrames; i++) {
    signal.frameSelected.dispatch(i);
  }

  signal.frameSelected.dispatch(frame);

  // select top-most layer
  editor.selectTopLayer();

  // setup zoom
  signal.zoomChanged.dispatch(editor.zoom);


  // select brush tool
  signal.toolSelected.dispatch(editor.tool);

  //setInterval(minutely, 60000);
};