var Workspace = function() {};

Workspace.prototype = Object.create(null);
Workspace.prototype.constructor = Workspace;

Workspace.prototype.data = {
  file: null,
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
  background: {
    type: 'pattern',
    value: 'checkerboard',
  },
};

// update workspace with current editor data
Workspace.prototype.update = function() {
  // this.data.file = editor.file.name;
  this.data.tool = editor.tool.selected;
  this.data.frame = editor.frames.selected;
  this.data.layer = editor.layers.selected;
  this.data.palette = editor.palettes.selected;
  this.data.color = editor.color.brush.hexString();
  this.data.grid = editor.grid.enabled;
  this.data.zoom = editor.zoom.current;
  this.data.selection = {
    bounds: editor.selection.bounds,
    //pixels: editor.selection.pixels,
  };
  this.data.brightnessTool = {
    mode: editor.brightnessTool.mode,
    intensity: editor.brightnessTool.intensity,
  };
  this.data.background = {
    type: editor.background.type,
    value: editor.background.value,
  };
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

  // editor.file.name = this.data.file;
  editor.tool.selected = this.data.tool;
  editor.frames.selected = this.data.frame;
  editor.layers.selected = this.data.layer;
  editor.palettes.selected = this.data.palette;
  editor.color.brush = new Color(this.data.color);
  editor.grid.enabled = this.data.grid;
  editor.zoom.current = this.data.zoom;
  editor.selection.bounds = restoreSelectionBounds.call(this);
  //editor.selection.pixels = this.data.selection.pixels;
  editor.brightnessTool.mode = this.data.brightnessTool.mode;
  editor.brightnessTool.intensity = this.data.brightnessTool.intensity;
  editor.background.type = this.data.background.type;
  editor.background.value = this.data.background.value;
};

Workspace.prototype.load = function() {
  var json = localStorage.getItem('workspace');
  if(json) {
    this.data = JSON.parse(json);
    this.setup();
  }
};

Workspace.prototype.save = function() {
  this.update();
  var json = JSON.stringify(this.data);
  localStorage.setItem('workspace', json);
};

Workspace.prototype.clear = function() {
  localStorage.removeItem('workspace');
  document.location.reload();
}