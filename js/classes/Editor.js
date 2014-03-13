var Editor = function() {

  var maxZoom = 50,
      minZoom = 1,
      self = this;

  this.zoom = 10;
  this.grid = true;
  this.layer;
  this.pixel = {x:0, y:0};
  this.tool;
  this.color = Color('#000000');

  // signal handlers
  signal.layerSelected.add(function(id) {
    self.layer = id;
  });

  signal.toolSelected.add(function(tool) {
    self.tool = tool;
  });

  signal.colorPicked.add(function(color) {
    self.color = Color(color);
  });

  signal.zoomChanged.add(function(zoom) {
    self.zoom = parseInt(zoom, 10) || self.zoom;
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