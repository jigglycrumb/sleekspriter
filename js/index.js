// Debug helpers

function showOffScreen() {
  document.querySelector('.area.offscreen').style.display = 'block';
};

function hideOffScreen() {
  document.querySelector('.area.offscreen').style.display = 'none';
};

function redrawFromFile() {
  console.log('redrawing from file');

  // clear all layer canvases
  file.layers.forEach(function(layer) {
    var canvas = document.getElementById('StageBoxLayer-'+layer.id);
        canvas.width = canvas.width;
  });

  // get frame layer IDs
  var frameLayers = editor.layers.getIds();

  // draw all pixels that belong to frame
  file.pixels.forEach(function(px) {
    if(inArray(frameLayers, px.layer)) {
      Pixel.publish(px.frame, px.layer, px.x, px.y, px.z, px.toHex());
    }
  });
};

// -----------------------------------------------------------------------

function NodeList2Array(NodeList) {
  //return [ ... NodeList ]; // ES6 version, doesn't work with JSX compiler
  return [].slice.call(NodeList);
};

function inArray(array, value) {
  return array.indexOf(value) > -1;
};

function fitCanvasIntoSquareContainer(canvasWidth, canvasHeight, containerSize) {
  var w = canvasWidth,
      h = canvasHeight,
      style = {},
      scale;

  if(w > h) scale = Math.floor(containerSize/w);
  else scale = Math.floor(containerSize/h);

  style.marginTop = Math.floor((containerSize - Math.round(h*scale))/2);
  style.marginLeft = Math.floor((containerSize - Math.round(w*scale))/2);

  w = Math.round(w*scale);
  h = Math.round(h*scale);

  return {
    width: w,
    height: h,
    style: style
  }
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
  var layer = file.getLayerById(editor.layers.selected);
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

// move this into window.onload later

var channel = postal.channel('pixler');
var wireTap = new postal.diagnostics.DiagnosticsWireTap({
    name: "console",
    filters: [
        //{ channel: "pixler" },
        //{ data: { foo: /bar/ } },
        { topic: "stage.pixel.fill" },
        { topic: "stage.pixel.clear" },
        //{ topic: "app.frame.select" },
        //{ topic: "app.layer.select" },
    ],
    //active: false,
});


var file = new File();
var stage = new Stage();
var editor = new Editor();
var hotkeys = new Hotkeys(editor);
var workspace = new Workspace();

workspace.load();

if(!workspace.data.file) { // no file, show open dialog/title screen/whatever
  // nothing to see here yet
  console.log('no file in workspace found');
}
else { // re-open last file
  File.load(workspace.data.file, fileLoaded);
}

function fileLoaded(json) {
  console.log('file loaded');

  // init file
  file.fromJSON(json);

  // init auto palette
  editor.palettes.buildAuto();

  // select last selected frame (also initializes layers)
  channel.publish('app.frame.select', {frame: editor.frame.selected});

  /*
  // draw all pixels to layers
  file.pixels.forEach(function(px) {
    Pixel.publish(file.getFrameIdForLayer(px.layer), px.layer, px.x, px.y, px.z, px.toHex());
  });
  */

  // render UI
  React.renderComponent( App({ editor: editor, workspace: workspace }), document.body);
}


// //window.onbeforeunload = workspace.save;

// window.onload = function() {


//   // select each frame once to initialize previews etc

//   var totalFrames = file.frames.x * file.frames.y,
//       frame = editor.frame.selected;
//   for(var i = 1; i <= totalFrames; i++) {
//     channel.publish('app.frame.select', {frame: i});
//   }


//   //channel.publish('app.frame.select', {frame: frame});
//   //channel.publish('app.frame.select', {frame: 1});

//   // set inital zoom
//   channel.publish('stage.zoom.select', {zoom: editor.zoom.current});

//   // select brush tool
//   channel.publish('app.tool.select', {tool: editor.tool});

// };