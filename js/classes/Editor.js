var Editor = function() {

  var maxZoom = 50,
      minZoom = 1,
      self = this;

  this.frame = 1;
  this.lastFrame = 1;

  this.layer = null;

  this.selectTopLayer = function() {
    var frameLayers = _.where(file.layers, {frame: this.frame});
    var topLayer = _.max(frameLayers, function(layer) { return layer.z; });
    signal.layerSelected.dispatch(topLayer.id);
  }

  this.zoom = 10;
  this.grid = true;
  this.pixel = {x:0, y:0};
  this.pixelColor = Color('#000000');
  this.layerPixelColor = Color('#000000');
  this.tool = 'BrushTool';
  this.color = Color('#000000');

  this.brightnessToolMode = 'lighten';
  this.brightnessToolIntensity = 10;


  this.palette = 'sprite';

  this.palettes = {
    sprite: {
      title: 'Sprite colours',
      short: 'Sprite',
      colors: [],
    },
    gameboy: {
      title: 'Nintendo Gameboy',
      short: 'GB',
      colors: ['#9bbc0f', '#8bac0f', '#306230', '#0f380f'],
    },
    teletext: {
      title: 'Teletext',
      short: 'TTX',
      colors: ['#000000', '#0000ff', '#ff0000', '#ff00ff', '#00ff00', '#00ffff', '#ffff00', '#ffffff'],
    },
    apple2: {
      title: 'Apple II',
      short: '][',
      colors: ['#000000', '#6c2940', '#403578', '#d93cf0', '#135740', '#808080', '#2697f0', '#bfb4f8',
               '#404b07', '#d9680f', '#eca8bf', '#26c30f', '#bfca87', '#93d6bf', '#ffffff'],
    },
    spectrum: {
      title: 'Sinclair ZX Spectrum',
      short: 'Spectrum',
      colors: ['#000000', '#0000c0', '#0000ff', '#c00000', '#ff0000', '#c000c0', '#ff00ff', '#00c000',
               '#00ff00', '#00c0c0', '#00ffff', '#c0c000', '#ffff00', '#c0c0c0', '#ffffff'],
    },
    cga: {
      title: 'Color Graphics Adapter',
      short: 'CGA',
      colors: ['#000000', '#555555', '#aaaaaa', '#ffffff', '#0000aa', '#5555ff', '#00aa00', '#55ff55',
               '#00aaaa', '#55ffff', '#aa0000', '#ff5555', '#aa00aa', '#ff55ff', '#aa5500', '#ffff55'],
    },
    vic20: {
      title: 'Commodore VIC-20',
      short: 'VIC-20',
      colors: ['#000000', '#ffffff', '#aa7449', '#eab489', '#782922', '#b86962', '#87d6dd', '#c7ffff',
               '#aa5fb6', '#ea9ff6', '#55a049', '#94e089', '#40318d', '#8071cc', '#bfce72', '#ffffb2'],
    },
    c64: {
      title: 'Commodore C=64',
      short: 'C=64',
      colors: ['#000000', '#505050', '#787878', '#9f9f9f', '#ffffff', '#8b5429', '#574200', '#883932',
               '#b86962', '#67b6bd', '#8b3f96', '#40318d', '#7869c4', '#55a049', '#94e089', '#bfce72'],
    },
    amstrad: {
      title: 'Amstrad CPC',
      short: 'CPC',
      colors: ['#000000', '#008000', '#00ff00', '#000080', '#008080', '#00ff80', '#0000ff', '#0080ff',
               '#00ffff', '#800000', '#808000', '#80ff00', '#800080', '#808080', '#80ff80', '#8000ff',
               '#8080ff', '#80ffff', '#ff0000', '#ff8000', '#ffff00', '#ff0080', '#ff8080', '#ffff80',
               '#ff00ff', '#ff80ff', '#ffffff'],
    },
    nes: {
      title: 'Nintendo Entertainment System',
      short: 'NES',
      colors: ['#000000', '#080808', '#7c7c7c', '#bcbcbc', '#d8d8d8', '#fcfcfc', '#0000fc', '#0078f8',
               '#3cbcfc', '#a4e4fc', '#0000bc', '#0058f8', '#6888fc', '#b8b8f8', '#4428bc', '#6844fc',
               '#9878f8', '#d8b8f8', '#940084', '#d800cc', '#f878f8', '#f8b8f8', '#a80020', '#e40058',
               '#f85898', '#f8a4c0', '#a81000', '#f83800', '#f87858', '#f0d0b0', '#881400', '#e45c10',
               '#fca044', '#fce0a8', '#503000', '#ac7c00', '#f8b800', '#f8d878', '#007800', '#00b800',
               '#b8f818', '#d8f878', '#006800', '#00a800', '#58d854', '#b8f8b8', '#005800', '#00a844',
               '#58f898', '#b8f8d8', '#004058', '#008888', '#00e8d8', '#00fcfc'],
    },
    mastersystem: {
      title: 'Sega Master System',
      short: 'Sega MS',
      colors: ['#000000', '#000055', '#0000aa', '#0000ff', '#0055ff', '#00aaff', '#00ffff', '#00ffaa',
               '#00aaaa', '#0055aa', '#005555', '#005500', '#00aa00', '#00aa55', '#00ff55', '#00ff00',
               '#55ff00', '#55ff55', '#55aa55', '#55aa00', '#555500', '#555555', '#5555aa', '#55aaaa',
               '#55ffaa', '#55ffff', '#55aaff', '#5555ff', '#5500ff', '#5500aa', '#550055', '#550000',
               '#aa0000', '#aa0055', '#aa00aa', '#aa00ff', '#aa55ff', '#aaaaff', '#aaffff', '#aaffaa',
               '#aaaaaa', '#aa55aa', '#aa5555', '#aa5500', '#aaaa00', '#aaaa55', '#aaff55', '#aaff00',
               '#ffff00', '#ffff55', '#ffaa55', '#ffaa00', '#ff5500', '#ff5555', '#ff55aa', '#ffaaaa',
               '#ffffaa', '#ffffff', '#ffaaff', '#ff55ff', '#ff00ff', '#ff00aa', '#ff0055', '#ff0000'],
    },
    atari2600: {
      title: 'Atari 2600',
      short: '2600',
      colors: ['#000000', '#404040', '#6c6c6c', '#909090', '#b0b0b0', '#c8c8c8', '#dcdcdc', '#ececec',
               '#444400', '#646410', '#848424', '#a0a034', '#b8b840', '#d0d050', '#e8e85c', '#fcfc68',
               '#702800', '#844414', '#985c28', '#ac783c', '#bc8c4c', '#cca05c', '#dcb468', '#e8cc7b',
               '#841800', '#983418', '#ac5030', '#c06848', '#d0805c', '#e09470', '#eca880', '#fcbc94',
               '#880000', '#9c2020', '#b03c3c', '#c05858', '#d07070', '#e08888', '#eca0a0', '#fcb4b4',
               '#78005c', '#8c2074', '#a03c88', '#b0589c', '#c070b0', '#d084c0', '#dc9cd0', '#ecb0e0',
               '#480078', '#602090', '#783ca4', '#8c58b8', '#a070cc', '#b484dc', '#c49cec', '#d4b0fc',
               '#140084', '#302098', '#4c3cac', '#6858c0', '#7c70d0', '#9488e0', '#a8a0ec', '#bcb4fc',
               '#000088', '#1c209c', '#3840b0', '#505cc0', '#6874d0', '#7c8ce0', '#90a4ec', '#a4b8fc',
               '#00187c', '#1c3890', '#3854a8', '#5070bc', '#6888cc', '#7c9cdc', '#90b4ec', '#a4c8fc',
               '#002c5c', '#1c4c78', '#386890', '#5084ac', '#689cc0', '#7cb4d4', '#90cce8', '#a4e0fc',
               '#00402c', '#1c5c48', '#387c64', '#509c80', '#68b494', '#7cd0ac', '#90e4c0', '#a4fcd4',
               '#003c00', '#205c20', '#407c40', '#5c9c5c', '#74b474', '#8cd08c', '#a4e4a4', '#b8fcb8',
               '#143800', '#345c1c', '#507c38', '#6c9850', '#84b468', '#9ccc7c', '#b4e490', '#c8fca4',
               '#2c3000', '#4c501c', '#687034', '#848c4c', '#9ca864', '#b4c078', '#ccd488', '#e0ec9c',
               '#442800', '#644818', '#846830', '#a08444', '#b89c58', '#d0b46c', '#e8cc7c', '#fce08c'],
    },
  };

  this.buildAutoPalette = function() {
    var palette = [];
    file.pixels.forEach(function(pixel) {
      var color = Color().rgb(pixel.r, pixel.g, pixel.b).hexString();
      palette.push(color);
    });

    this.palettes.sprite.colors = _.uniq(palette, false);
  };


  this.selection = false;

  this.selectionContains = function(point) {
    if(this.selection) {
      if(!_.isUndefined(this.selection.start)
      && !_.isUndefined(this.selection.end)) {
        // ok, selection is valid
        return point.x >= this.selection.start.x
        && point.x <= this.selection.end.x
        && point.y >= this.selection.start.y
        && point.y <= this.selection.end.y;
      }
    }
  };

  this.selectionActive = function() {
    return this.selection.start instanceof Point && this.selection.end instanceof Point;
  };

  this.pixels = [];

  this.deletePixel = function(layer, x, y) {
    this.pixels = this.pixels.filter(function(pixel) {
      return !(pixel.layer == layer && pixel.x == x && pixel.y == y);
    });
  };

  this.saveChanges = function() {
    console.log('saving changes');
    // grab all old pixels of current frame
    var frameLayers = _.pluck(this.pixels, 'layer');
    var pixels = this.pixels;
    file.pixels.forEach(function(pixel) {
      if(!inArray(frameLayers, pixel.layer)) pixels.push(pixel);
    });

    file.pixels = pixels;
  };


  // signal handlers
  signal.frameSelected.add(function(frame) {

    self.saveChanges();

    self.frame = parseInt(frame);
    self.selectTopLayer();

    var frameLayers = _.where(file.layers, {frame: self.frame});
    var pixels = [];

    frameLayers.forEach(function(layer) {
      var layerPixels = _.where(file.pixels, {layer: layer.id});
      pixels.push(layerPixels);
    });

    self.pixels = _.flatten(pixels);
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

  signal.pixelSelected.add(function(point) {
    self.pixel = point;
  });

  signal.pixelFilled.add(function(layer, x, y, color) {

    // update sprite palette
    self.palettes.sprite.colors.push(color.hexString());
    self.palettes.sprite.colors = _.uniq(self.palettes.sprite.colors, false);

    // add/replace pixel
    var c = color.rgb(),
        a = 1;

    var newPixel = {layer: layer, x: x, y: y, r: c.r, g: c.g, b: c.b, a: a};
    var oldPixel = _.findWhere(self.pixels, {layer: layer, x: x, y: y});
    if(_.isUndefined(oldPixel)) {
      //console.log('filling pixel', layer, x, y, color.rgbString());
      self.pixels.push(newPixel);
    }
    else {
      //console.log('replacing pixel', layer, x, y, color.rgbString());
      // replace old pixel
      for(var i = 0; i < self.pixels.length; i++) {
        var p = self.pixels[i];
        if(p.layer == layer && p.x == x && p.y == y) {
          p.r = c.r;
          p.g = c.g;
          p.b = c.b;
          p.a = a;
          break;
        }
      }
    }

    signal.layerContentChanged.dispatch(layer);
  });

  signal.pixelCleared.add(function(layer, x, y) {
    self.buildAutoPalette();
    self.deletePixel(layer, x, y);
    signal.layerContentChanged.dispatch(layer);
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

  signal.selectionStarted.add(function(point) {
    self.selection = {
      start: point
    };
  });

  signal.selectionEnded.add(function(point) {

    self.selection.end = point;

    // switch start & end if start is more "lower right" than end
    // makes iterating over the selection easier later
    if(self.selection.start.x > self.selection.end.x
    || self.selection.start.y > self.selection.end.y) {
      var temp = self.selection.start;
      self.selection.start = self.selection.end;
      self.selection.end = temp;
    }
  });

  signal.selectionCleared.add(function(point) {
    self.selection = false;
  });

  signal.selectionMoved.add(function(distance) {
    self.selection = {
      start: new Point(
        self.selection.start.x + distance.x,
        self.selection.start.y + distance.y
      ),
      end: new Point(
        self.selection.end.x + distance.x,
        self.selection.end.y + distance.y
      )
    };
  });

  signal.pixelsMoved.add(function(distance) {

    self.pixels.forEach(function(pixel) {
      pixel.x += distance.x;
      pixel.y += distance.y;
    });

    self.saveChanges();
  });
};

var editor = new Editor();