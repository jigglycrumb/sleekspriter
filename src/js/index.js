// Debug helpers
// var consoleMethods = ['log', 'warn'];
// consoleMethods.forEach(function(method) {
//   var old = console[method];
//   console[method] = function() {
//     var stack = (new Error()).stack.split(/\n/);
//     // Chrome includes a single "Error" line, FF doesn't.
//     if (stack[0].indexOf('Error') === 0) {
//       stack = stack.slice(1);
//     }
//     var args = [].slice.apply(arguments).concat([stack[1].trim()]);
//     return old.apply(console, args);
//   };
// });

function resetWorkspace() {
  localStorage.removeItem('workspace');
  workspace.setup();
  editor.file.name = 'coin.pixels';
  workspace.save();
  document.location.reload();
};

function redrawFromFile() {
  console.log('redrawing from file');

  // clear all layer canvases
  file.layers.forEach(function(layer) {
    if(editor.frame.selected === layer.frame) {
      var canvas = document.getElementById('StageBoxLayer-'+layer.id);
      canvas.width = canvas.width;
    }
  });

  // get frame layer IDs
  var frameLayers = editor.layers.getIds();

  // draw all pixels that belong to frame
  editor.pixels.frame.forEach(function(px) {
    Pixel.add(px.frame, px.layer, px.x, px.y, px.z, px.toHex());
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
        // { channel: "pixler" },
        // { data: { foo: /bar/ } },
        // {topic: 'scope.set'},
        // {topic: 'canvas.preview'},
        // {topic: 'canvas.refresh'},
        // {topic: /selection/},
        // {topic: 'pixel.add'},
        // {topic: 'frame.select'},
        {topic: 'screen.select'},
    ],
    // active: false,
});


var file = new File();
var editor = new Editor();
var hotkeys = new Hotkeys(editor);
var workspace = new Workspace();

workspace.load();

if(!workspace.data.file) { // no file, show open dialog/title screen/whatever
  // nothing to see here yet
  console.warn('no file in workspace found');
}
else { // re-open last file
  File.load(workspace.data.file, fileLoaded);
}

function fileLoaded(json) {

  // init file
  file.fromJSON(json);

  // select last selected frame
  channel.publish('frame.select', {frame: editor.frame.selected});

  // render UI
  var container = document.body;
  React.renderComponent( App({ editor: editor, workspace: workspace }), container);
}

// window.onbeforeunload = workspace.save;
// window.onload = function() {};