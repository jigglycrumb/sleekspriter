var Workspace = function() {};

Workspace.prototype = Object.create(null);
Workspace.prototype.constructor = Workspace;

Workspace.prototype.data = {
  tool: 'BrushTool',
  frame: 1,
  layer: null,
  palette: 'sprite',
  color: '#000000',
  grid: true,
  zoom: 10,
  //selection: false,
  brightnessTool: {
    mode: 'lighten',
    intensity: 10,
  },
  selection: {
    bounds: false,
    pixels: [],
  },
  folds: {
    preview: false,
    frames: false,
    layers: false,
  },
};

// update workspace with current editor data
Workspace.prototype.update = function() {
  this.data.tool = editor.tool;
  this.data.frame = editor.frame;
  this.data.layer = editor.layer;
  this.data.palette = editor.palette;
  this.data.color = editor.color.hexString();
  this.data.grid = editor.grid;
  this.data.zoom = editor.zoom;
  this.data.selection = {
    bounds: editor.selection.bounds,
    pixels: editor.selection.pixels,
  };
  this.data.brightnessTool.mode = editor.brightnessToolMode;
  this.data.brightnessTool.intensity = editor.brightnessToolIntensity;

  // TODO: include folds
};


// setup editor from workspace data
Workspace.prototype.setup = function() {

  var restoreSelectionBounds = function() {
    var bounds = false;
    if(!_.isUndefined(this.data.selection.bounds.start) && !_.isUndefined(this.data.selection.bounds.end)) {
      bounds = {
        start: new Point(this.data.selection.bounds.start.x, this.data.selection.bounds.start.y),
        end: new Point(this.data.selection.bounds.end.x, this.data.selection.bounds.end.y),
      };
    }
    return bounds;
  };

  editor.tool = this.data.tool;
  editor.frame = this.data.frame;
  editor.layer = this.data.layer;
  editor.palette = this.data.palette;
  editor.color = new Color(this.data.color);
  editor.grid = this.data.grid;
  editor.zoom = this.data.zoom;
  editor.selection.bounds = restoreSelectionBounds.call(this);
  editor.selection.pixels = this.data.selection.pixels;
  editor.brightnessToolMode = this.data.brightnessTool.mode;
  editor.brightnessToolIntensity = this.data.brightnessTool.intensity;

  // TODO: include folds
};

Workspace.prototype.load = function() {
  var json = localStorage.getItem('workspace');
  this.data = JSON.parse(json);
  this.setup();
};

Workspace.prototype.save = function() {
  this.update();
  var json = JSON.stringify(this.data);
  localStorage.setItem('workspace', json);
};