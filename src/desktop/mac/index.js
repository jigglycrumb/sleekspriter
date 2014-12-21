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
  workspace.save();
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

function resize() {
  channel.publish('window.resize');
}

window.onresize = resize;

// move this into window.onload later

var channel = postal.channel('pixler');
// var wireTap = new postal.diagnostics.DiagnosticsWireTap({
//     name: "console",
//     filters: [
//         // { channel: "pixler" },
//         // {topic: 'animation.frame.select'},
//     ],
//     active: false,
// });


var file = new File();
var editor = new Editor();
var hotkeys = new Hotkeys(editor);
var workspace = new Workspace();

// workspace.load();

// if(!workspace.data.file) { // no file, show open dialog/title screen/whatever
//   // nothing to see here yet
//   console.warn('no file in workspace found');
//   resetWorkspace();
// }
// else { // re-open last file
//   File.load(workspace.data.file, fileLoaded);
// }

resetWorkspace(); // temporary

function fileLoaded(json) {
  // init file
  file.fromJSON(json);
  // select last selected frame
  channel.publish('frame.select', {frame: editor.frame.selected});
}

// render UI
var container = document.getElementById('app-container');
React.render(React.createElement(App, {editor: editor, workspace: workspace}), container);

// window.onbeforeunload = workspace.save;
// window.onload = function() {};





// ------------------------------------------------------------------------------------------------
// Desktop menu
// ------------------------------------------------------------------------------------------------

// helper to click hidden file inputs for load and save dialogs
function clickInput(id) {
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click');
  document.getElementById(id).dispatchEvent(event);
}

// bind file input change handlers
document.getElementById('fileOpen').addEventListener('change', function (e) {
  file.load(this.value, fileLoaded);
});

document.getElementById('fileSave').addEventListener('change', function (e) {
  file.save(this.value);
});

// import node requirements
var gui = require('nw.gui');
var win = gui.Window.get();
var windowMenu = new gui.Menu({ type: "menubar" });

// create default mac menu
windowMenu.createMacBuiltin("@@app", {
  hideEdit: true,
  hideWindow: true
});
win.menu = windowMenu;

// create file submenu
var fileMenu = new gui.Menu();
win.menu.insert(new gui.MenuItem({label: 'File', submenu: fileMenu}), 1);

fileMenu.insert(new gui.MenuItem({
  label: 'Open',
  click: function() {
    clickInput('fileOpen');
  },
  key: 'o',
  modifiers: 'cmd'
}), 0);

fileMenu.insert(new gui.MenuItem({
  label: 'Save',
  click: function() {
    file.save();
  },
  key: 's',
  modifiers: 'cmd',
  enabled: false,
}), 1);

fileMenu.insert(new gui.MenuItem({
  label: 'Save as',
  click: function() {
    clickInput('fileSave');
  },
  key: 's',
  modifiers: 'shift-cmd',
  enabled: false,
}), 2);

// create selection menu
var selectionMenu = new gui.Menu();
win.menu.insert(new gui.MenuItem({label: 'Select', submenu: selectionMenu}), 2);

selectionMenu.insert(new gui.MenuItem({
  label: 'All',
  click: function() {
    var start = new Point(1, 1),
        end = new Point(file.size.width, file.size.height);

    channel.publish('selection.clear');
    channel.publish('selection.start', {point: start});
    channel.publish('selection.end', {point: end});
  },
  key: 'a',
  modifiers: 'cmd',
  enabled: false,
}), 0);

selectionMenu.insert(new gui.MenuItem({
  label: 'Deselect',
  click: function() {
    channel.publish('selection.clear');
  },
  key: 'd',
  modifiers: 'cmd',
  enabled: false,
}), 1);

// create layer menu
var layerMenu = new gui.Menu();
win.menu.insert(new gui.MenuItem({label: 'Layer', submenu: layerMenu}), 3);

layerMenu.insert(new gui.MenuItem({
  label: 'Merge with layer above',
  click: function() {
    console.log('merge with above');
  },
  key: 'e',
  modifiers: 'shift-cmd',
  enabled: false,
}), 0);

layerMenu.insert(new gui.MenuItem({
  label: 'Merge with layer below',
  click: function() {
    console.log('merge with below');
  },
  key: 'e',
  modifiers: 'cmd',
  enabled: false,
}), 1);



channel.subscribe('file.load', function() {
  function enable(item) { item.enabled = true; }
  fileMenu.items.map(enable);
  selectionMenu.items.map(enable);
  layerMenu.items.map(enable);
});


// Create a separator
// item = new gui.MenuItem({ type: 'separator' });



