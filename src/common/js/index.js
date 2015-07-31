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
  var layer = storeUtils.layers.getSelected();
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

function refreshPreviews() {
  channel.gui.publish('canvas.refresh', {
    frame: flux.stores.UiStore.getData().frames.selected,
    layer: flux.stores.UiStore.getData().layers.selected,
  });
};

var stores, flux, channel, platformUtils, storeUtils, file, editor, hotkeys, container;

function base_init() {
  stores = {
    FileStore: new FileStore(),
    UiStore: new UiStore(),
  };

  flux = new Fluxxor.Flux(stores, actions);

  flux.on('dispatch', function(type, payload) {
    if(console && console.log) {
      console.log("[Dispatch]", type, payload);
    }
  });

  channel = {
    file: postal.channel('file'),
    gui: postal.channel('gui'),
  };

  platformUtils = new PlatformUtils();
  storeUtils = new StoreUtils();
  file = new File();
  editor = new Editor();
  hotkeys = new Hotkeys(editor);
  container = document.getElementById('app-container');

  window.onresize = function(e) { channel.gui.publish('window.resize'); };
}

// read palettes from json file and start App
var fs = require('fs');
fs.readFile('json/palettes.json', function(error, contents) {
  if(error) throw error;
  var json = JSON.parse(contents);
  base_init();
  flux.actions.paletteLoad(json);
  platform_init();
  menu_init();
});