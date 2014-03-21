var Editor = function() {

  var maxZoom = 50,
      minZoom = 1,
      self = this;

  this.frame = 1;
  this.layer = null;
  this.zoom = 10;
  this.grid = true;
  this.pixel = {x:0, y:0};
  this.pixelColor = Color('#000000');
  this.tool = 'BrushTool';
  this.color = Color('#000000');

  // signal handlers
  signal.frameSelected.add(function(frame) {
    self.frame = parseInt(frame);
  });

  signal.layerSelected.add(function(id) {
    self.layer = id;
  });

  signal.toolSelected.add(function(tool) {
    self.tool = tool;
  });

  signal.colorSelected.add(function(color) {
    self.color = Color(color);
  });

  signal.zoomChanged.add(function(zoom) {
    self.zoom = parseInt(zoom) || self.zoom;
    self.zoom = self.zoom > maxZoom ? maxZoom : self.zoom;
    self.zoom = self.zoom < minZoom ? minZoom : self.zoom;
  });

  signal.pixelSelected.add(function(x, y) {
    self.pixel = {x: x, y: y};
  });

  signal.gridToggled.add(function(grid) {
    self.grid = grid;
  });
};

var editor = new Editor();