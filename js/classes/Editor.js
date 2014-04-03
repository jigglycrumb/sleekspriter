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
  this.layerPixelColor = Color('#000000');
  this.tool = 'BrushTool';
  this.color = Color('#000000');

  this.brightnessToolMode = 'lighten';
  this.brightnessToolIntensity = 10;

  this.palettes = {
    Sprite: [],
  };
  this.palette = 'Sprite';

  this.buildAutoPalette = function() {
    var palette = [];
    file.pixels.forEach(function(pixel) {
      var color = Color().rgb(pixel.r, pixel.g, pixel.b);
      palette.push(color);
    });

    this.palettes.Sprite = _.uniq(palette, false, function(i){return i.rgbaString();})
  };

  this.selectTopLayer = function() {
    var frameLayers = _.where(file.layers, {frame: this.frame});
    var topLayer = _.max(frameLayers, function(layer) { return layer.z; });
    signal.layerSelected.dispatch(topLayer.id);
  }

  // signal handlers
  signal.frameSelected.add(function(frame) {
    self.frame = parseInt(frame);
    self.selectTopLayer();
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

  signal.pixelFilled.add(function(layer, x, y, color) {
    self.palettes.Sprite.push(color);
    self.palettes.Sprite = _.uniq(self.palettes.Sprite, false, function(i){return i.rgbaString();})
  });

  signal.pixelCleared.add(function() {
    self.buildAutoPalette();
  });

  signal.gridToggled.add(function(grid) {
    self.grid = grid;
  });

  signal.brightnessToolIntensityChanged.add(function(intensity) {
    self.brightnessToolIntensity = intensity;
  });

  signal.brightnessToolModeChanged.add(function(mode){
    self.brightnessToolMode = mode;
  });

  signal.paletteSelected.add(function(palette) {
    self.palette = palette;
  });
};

var editor = new Editor();