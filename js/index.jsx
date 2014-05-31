/** @jsx React.DOM */
// Debug helpers

function showOffScreen() {
  document.querySelector('.area.offscreen').style.display = 'block';
};

function hideOffScreen() {
  document.querySelector('.area.offscreen').style.display = 'none';
};

function redrawFromFile() {
  console.log('redrawing from file');

  file.layers.forEach(function(layer) {
    var canvas = document.getElementById('StageBoxLayer-'+layer.id);
        canvas.width = canvas.width;
  });

  var frameLayers = editor.layers.getIds();

  file.pixels.forEach(function(pixel) {
    if(inArray(frameLayers, pixel.layer)) {
      var color = new Color({r: pixel.r, g: pixel.g, b: pixel.b});
      channel.publish('stage.pixel.fill', {
        frame: file.getFrameIdForLayer(pixel.layer),
        layer: pixel.layer,
        x: pixel.x,
        y: pixel.y,
        color: color.hexString()
      });
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

function minutely() {
  console.log('running minutely job');
  //editor.saveChanges();
  workspace.save();
};


// move this into window.onload later

var channel = postal.channel('pixler');
var wireTap = new postal.diagnostics.DiagnosticsWireTap({
    name: "console",
    filters: [
        //{ channel: "pixler" },
        //{ data: { foo: /bar/ } },
        //{ topic: "stage.pixel.fill" },
        //{ topic: "stage.pixel.clear" },
        { topic: "app.frame.select" },
    ],
    active: false,
});


var file = new File();
var stage = new Stage();
var editor = new Editor();
var hotkeys = new Hotkeys(editor);

var workspace = new Workspace();

window.onbeforeunload = workspace.save;

window.onload = function() {

  //workspace.load();

  // load file
  file.fromJSONString(savedFile);

  // init auto palette
  editor.palettes.buildAuto();




  /*
  // draw all pixels to layers
  file.pixels.forEach(function(px) {
    var color = new Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')');
    channel.publish('stage.pixel.fill', {
      frame: file.getFrameIdForLayer(px.layer),
      layer: px.layer,
      x: px.x,
      y: px.y,
      color: color.hexString()
    });
  });
  */

  // select each frame once to initialize previews etc
  /*
  var totalFrames = file.frames.x * file.frames.y,
      frame = editor.frame;
  for(var i = 1; i <= totalFrames; i++) {
    channel.publish('app.frame.select', {frame: i});
  }
  */

  //channel.publish('app.frame.select', {frame: frame});
  channel.publish('app.frame.select', {frame: 1});
  /*

  // select top-most layer
  editor.layers.selectTop();

  // set inital zoom
  channel.publish('stage.zoom.select', {zoom: editor.zoom});

  // select brush tool
  channel.publish('app.tool.select', {tool: editor.tool});
  */

  //setInterval(minutely, 60000);

  // render app
  React.renderComponent(
    <App editor={editor} workspace={workspace} />
    , document.body);
};

