/** @jsx React.DOM */
'use strict';
var Point = function(x, y) {
  this.x = x;
  this.y = y;
};

Point.prototype = Object.create(null);
Point.prototype.constructor = Point;

Point.prototype.translate = function(distance) {
  this.x += distance.x;
  this.y += distance.y;
  return this;
}
var Pixel = function(layer, x, y, r, g, b, a) {
  this.layer = layer;
  this.x = x;
  this.y = y;
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
};

Pixel.prototype = new Point();
Pixel.prototype.constructor = Pixel;

Pixel.fromArray = function(arr) {
  return new Pixel(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
};

Pixel.toArray = function(pixel) {
  return [pixel.layer, pixel.x, pixel.y, pixel.r, pixel.g, pixel.b, pixel.a];
};
var File = function() {

  this.size = null;
  this.frames = null;
  this.layers = null;
  this.pixels = null;

  var self = this;

  function sizeFromFile(size) {
    return {
      width: size[0],
      height: size[1]
    };
  };

  function sizeToFile(size) {
    return [size.width, size.height];
  };

  function framesFromFile(frames) {
    return {
      x: frames[0],
      y: frames[1]
    };
  };

  function framesToFile(frames) {
    return [frames.x, frames.y];
  };

  function layerFromFile(layer) {
    return {
      id: layer[0],
      frame: layer[1],
      name: layer[2],
      z: layer[3],
      opacity: layer[4],
      visible: !!layer[5]
    };
  };

  function layerToFile(layer) {
    return [
      layer.id,
      layer.frame,
      layer.name,
      layer.z,
      layer.opacity,
      +layer.visible
    ];
  };

  this.getLayerById = function(id) {
    return _.findWhere(this.layers, {id: id}) || false;
  };

  this.deletePixelsOfLayer = function(layer) {
    this.pixels = this.pixels.filter(function(pixel) {
      return pixel.layer !== layer;
    });
  };

  this.toJSONString = function() {
    var strObj = {
      size: sizeToFile(this.size),
      frames: framesToFile(this.frames),
      layers: this.layers.map(layerToFile),
      pixels: this.pixels.map(Pixel.toArray)
    };
    return JSON.stringify(strObj);
  };

  this.fromJSONString = function(json) {
    json = JSON.parse(json);
    this.size = sizeFromFile(json.size);
    this.frames = framesFromFile(json.frames);
    this.layers = json.layers.map(layerFromFile);
    this.pixels = json.pixels.map(Pixel.fromArray);

    // sort layers by z (top to bottom)
    this.layers = _.sortBy(this.layers, 'z').reverse();
  };

  function fixLayerZ(frame) {
    self.layers.reverse();
    var z = 0;
    for(var i = 0; i < self.layers.length; i++) {
      if( self.layers[i].frame == frame) {
        self.layers[i].z = z;
        z++;
      }
    }
    self.layers.reverse();
  }

  channel.subscribe('file.layer.opacity.select', function(data, envelope) {
    var layer = self.getLayerById(data.layer);
    layer.opacity = data.opacity;
  });

  channel.subscribe('file.layer.visibility.toggle', function(data, envelope) {
    var layer = self.getLayerById(data.layer);
    layer.visible = data.visible;
  });

  channel.subscribe('file.layer.name.select', function(data, envelope) {
    var layer = self.getLayerById(data.layer);
    layer.name = data.name;
  });

  channel.subscribe('file.layer.add', function(data, envelope) {
    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === data.layer) {
        index = i;
        break;
      }
    }

    var frameLayers = _.where(self.layers, {frame: editor.frame});
    var newZIndex = (_.max(frameLayers, function(layer) { return layer.z; })).z + 1;

    var newId = (_.max(self.layers, function(layer) { return layer.id; })).id + 1;
    var newLayer = layerFromFile([newId, editor.frame, 'layer '+newId, newZIndex, 100, true]);

    self.layers.splice(index, 0, newLayer);
    fixLayerZ(editor.frame);

    channel.publish('app.layer.add', {layer: newId});
  });

  channel.subscribe('file.layer.delete', function(data, envelope) {
    // delete layer pixels
    self.deletePixelsOfLayer(data.layer);

    // get layer array index of all layers
    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === data.layer) {
        index = i;
        break;
      }
    }

    // get layer array index of frame layers
    var frameLayers = _.where(self.layers, {frame: editor.frame});
    var fIndex = 0;
    for(var i=0; i < frameLayers.length; i++) {
      if(frameLayers[i].id === data.layer) {
        fIndex = i;
        break;
      }
    }

    // determine next layer to be selected in the UI
    var shouldSelectLayer;
    if(_.isUndefined(frameLayers[fIndex+1]))
      shouldSelectLayer = frameLayers[fIndex-1].id;
    else
      shouldSelectLayer = frameLayers[fIndex+1].id;

    // delete layer, reorder z indices, inform App of update
    self.layers.splice(index, 1);
    fixLayerZ(editor.frame);

    channel.publish('app.layer.delete', {layer: shouldSelectLayer});
  });
};
var Stage = function() {

  return {
    frame: {
      refresh: function(frame) {

        var frame = frame || editor.frame;

        this.clear();

        editor.pixels.forEach(function(px) {
          stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });

        if(editor.selection.pixels.length > 0) {
          var framelayers = editor.layers.getIds();

          editor.selection.pixels.forEach(function(px) {
            if(inArray(framelayers, px.layer)) stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
          });
        }
      },
      clear: function() {
        file.layers.forEach(function(layer) {
          var c = document.getElementById('StageBoxLayer-'+layer.id);
          c.width = c.width;
        });
      }
    },
    layer: {
      refresh: function() {
        var layerPixels = _.where(editor.pixels, {layer: editor.layers.selected}),
            selectionPixels = _.where(editor.selection.pixels, {layer: editor.layers.selected});

        this.clear();

        layerPixels.forEach(function(px) {
          stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });

        selectionPixels.forEach(function(px) {
          stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });
      },
      clear: function() {
        var c = document.getElementById('StageBoxLayer-'+editor.layers.selected);
        c.width = c.width;
      }
    },
    pixel: {
      fill: function(layer, x, y, color, forceDispatch) {

        //console.log('filling pixel', layer, x, y);

        var dispatch = forceDispatch || arguments.length == 0 ? true : false,
            layer = layer || editor.layers.selected,
            x = x || editor.pixel.x,
            y = y || editor.pixel.y,
            color = color || editor.color,
            ctx = document.getElementById('StageBoxLayer-'+layer).getContext('2d'),
            zoom = editor.zoom,
            cX = x -1,
            cY = y -1;

        ctx.fillStyle = color.hexString();
        ctx.fillRect(cX*zoom, cY*zoom, zoom, zoom);

        if(dispatch === true) channel.publish('stage.pixel.fill', {layer: layer, x: x, y: y, color: color.hexString()});
      },
      clear: function(layer, x, y) {

        var dispatch = arguments.length == 0 ? true : false,
            layer = layer || editor.layers.selected,
            x = x || editor.pixel.x,
            y = y || editor.pixel.y,
            ctx = document.getElementById('StageBoxLayer-'+layer).getContext('2d'),
            zoom = editor.zoom,
            cX = x -1,
            cY = y -1;

        ctx.clearRect(cX*zoom, cY*zoom, zoom, zoom);

        if(dispatch === true) channel.publish('stage.pixel.clear', {layer: layer, x: x, y: y});
      },
      lighten: function(layer, x, y) {
        if(editor.layerPixelColor.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.layerPixelColor, editor.brightnessTool.intensity);
        this.fill(layer, x, y, newColor, true);
        editor.layerPixelColor = newColor;
      },
      darken: function(layer, x, y) {
        if(editor.layerPixelColor.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.layerPixelColor, -editor.brightnessTool.intensity);
        this.fill(layer, x, y, newColor, true);
        editor.layerPixelColor = newColor;
      },
    }
  }
};
var Editor = function() {

  var maxZoom = 50,
      minZoom = 1,
      self = this;

  this.frame = 1;
  this.lastFrame = 1;

  this.zoom = 10;
  this.grid = true;
  this.pixel = new Point(0, 0);
  this.pixelColor = Color('#000000');
  this.layerPixelColor = Color('#000000');
  this.tool = 'BrushTool';
  this.color = Color('#000000');

  this.offset = {
    top: 40,
    right: 205,
    bottom: 27,
    left: 45,
  };


  this.pixels = []; // contains all pixels of the selected frame

  this.deletePixel = function(layer, x, y) {
    this.pixels = this.pixels.filter(function(pixel) {
      return !(pixel.layer == layer && pixel.x == x && pixel.y == y);
    });
  };

  var getFramePixels = function() {
    var frameLayers = _.where(file.layers, {frame: self.frame});
    var pixels = [];

    frameLayers.forEach(function(layer) {
      var layerPixels = _.where(file.pixels, {layer: layer.id});
      pixels.push(layerPixels);
    });

    return _.flatten(pixels);
  };

  var getAdjacentPixels = function(point) {

    var p,
        arr = [],
        bounds = {
          top: 1,
          right: file.size.width,
          bottom: file.size.height,
          left: 1,
        };

    if(self.selection.isActive) {
      bounds = {
        top: self.selection.start.y,
        right: self.selection.end.x,
        bottom: self.selection.end.y,
        left: self.selection.start.x,
      };
    }

    // top
    p = new Point(point.x, point.y-1);
    if(p.y >= bounds.top) arr.push(p);
    // right
    p = new Point(point.x+1, point.y);
    if(p.x <= bounds.right) arr.push(p);
    // bottom
    p = new Point(point.x, point.y+1);
    if(p.y <= bounds.bottom) arr.push(p);
    // left
    p = new Point(point.x-1, point.y);
    if(p.x >= bounds.left) arr.push(p);

    //console.log('found '+arr.length+' neighbors', arr);

    return arr;
  };

  this.saveChanges = function() {
    // grab all old pixels of current frame
    var frameLayers = this.layers.getIds();
    var pixels = this.pixels.slice(0); // slice clones the array
    file.pixels.forEach(function(pixel) {
      if(!inArray(frameLayers, pixel.layer)) pixels.push(pixel);
    });

    file.pixels = _.unique(pixels, function(p) { return p.layer+','+p.x+','+p.y });
    this.pixels = getFramePixels();
  };



  channel.subscribe('stage.grid.toggle', function(data, envelope) {
    self.grid = data.grid;
  });

  channel.subscribe('app.frame.select', function(data, envelope) {
    self.saveChanges();
    self.frame = parseInt(data.frame);
    self.layers.selectTop();
    self.pixels = getFramePixels();
  });

  channel.subscribe('app.tool.select', function(data, envelope) {
    self.tool = data.tool;
  });

  channel.subscribe('app.color.select', function(data, envelope) {
    self.color = new Color(data.color);
  });

  channel.subscribe('stage.zoom.select', function(data, envelope) {
    self.zoom = parseInt(data.zoom) || self.zoom;
    self.zoom = self.zoom > maxZoom ? maxZoom : self.zoom;
    self.zoom = self.zoom < minZoom ? minZoom : self.zoom;
  });

  channel.subscribe('stage.pixel.select', function(data, envelope) {
    self.pixel = data.point;
  });

  channel.subscribe('stage.pixel.clear', function(data, envelope) {
    self.palettes.buildAuto();
    self.deletePixel(data.layer, data.x, data.y);
    channel.publish('stage.layer.update', {layer: data.layer});
  });

  channel.subscribe('stage.pixel.fill', function(data, envelope) {
    // update sprite palette
    self.palettes.available.sprite.colors.push(data.color);
    self.palettes.available.sprite.colors = _.uniq(self.palettes.available.sprite.colors, false);

    // add/replace pixel
    var c = new Color(data.color),
        a = 1;

    var newPixel = new Pixel(data.layer, data.x, data.y, c.red(), c.green(), c.blue(), a);
    var oldPixel = _.findWhere(self.pixels, {layer: data.layer, x: data.x, y: data.y});
    if(_.isUndefined(oldPixel)) {
      //console.log('filling pixel', data.layer, data.x, data.y, c.rgbString());
      self.pixels.push(newPixel);
    }
    else {
      //console.log('replacing pixel', data.layer, data.x, data.y, c.rgbString());
      // replace old pixel
      for(var i = 0; i < self.pixels.length; i++) {
        var p = self.pixels[i];
        if(p.layer == data.layer && p.x == data.x && p.y == data.y) {
          p.r = c.red();
          p.g = c.green();
          p.b = c.blue();
          p.a = a;
          break;
        }
      }
    }

    self.saveChanges(); // TODO: check if call can be removed

    channel.publish('stage.layer.update', {layer: data.layer});
  });


  channel.subscribe('stage.tool.paintbucket', function(data, envelope) {
    var initialPixel = _.findWhere(self.pixels, {x: data.point.x, y: data.point.y, layer: self.layer}),
        initialColor,
        fillColor = self.color;

    if(_.isUndefined(initialPixel)) { // check if initial pixel is transparent
      initialPixel = {layer: self.layer, x: data.point.x, y: data.point.y, r: 0, g: 0, b: 0, a: 0};
    }

    initialColor = new Color({r: initialPixel.r, g: initialPixel.g, b: initialPixel.b});
    initialColor.alpha(initialPixel.a);

    var filled = [];

    function rFill(point) {

      filled.push(point);

      var pixel = _.findWhere(self.pixels, {layer: self.layer, x: point.x, y: point.y}),
          pixelColor,
          neighbors;

      if(_.isUndefined(pixel)) {
        pixelColor = new Color().rgb(0, 0, 0);
        pixelColor.alpha(0);
      }
      else pixelColor = new Color().rgb(pixel.r, pixel.g, pixel.b);

      if(pixelColor.rgbString() == initialColor.rgbString()) {
        stage.pixel.fill(self.layer, point.x, point.y, fillColor, true);
        neighbors = getAdjacentPixels(point);
        neighbors.forEach(function(n) {
          var old = _.findWhere(filled, {x: n.x, y: n.y});
          if(_.isUndefined(old)) rFill(n);
        });
      }
    }

    rFill(initialPixel);
  });

  channel.subscribe('stage.tool.move', function(data, envelope) {
    if(self.selection.isActive) {
      self.selection.pixels.forEach(function(pixel) {
        var target = wrapPixel(pixel, data.distance);
        pixel.x = target.x;
        pixel.y = target.y;
      });
    }
    else {
      self.pixels.forEach(function(pixel) {
        if(pixel.layer == self.layer) {
          var target = wrapPixel(pixel, data.distance);
          pixel.x = target.x;
          pixel.y = target.y;
        }
      });
    }

    self.saveChanges();
  });

  // init subclasses
  this.layers.init();
  this.selection.init(this);
  this.brightnessTool.init();
  this.palettes.init();
};

Editor.prototype = {}; //Object.create(null);
Editor.prototype.constructor = Editor;
Editor.prototype.layers = {};
Editor.prototype.layers.selected = null;
Editor.prototype.layers.frame = {};

Editor.prototype.layers.init = function() {
  var self = this;

  channel.subscribe('app.frame.select', function(data, envelope) {
    self.frame = _.where(file.layers, {frame: data.frame});
  });

  channel.subscribe('app.layer.select', function(data, envelope) {
    self.selected = data.layer;
  });
};

Editor.prototype.layers.getIds = function() {
  return _.pluck(this.frame, 'id');
};

Editor.prototype.layers.selectTop = function() {
  var topLayer = _.max(this.frame, function(layer) { return layer.z; });
  channel.publish('app.layer.select', {layer: topLayer.id});
};
Editor.prototype.palettes = {};
Editor.prototype.palettes.selected = 'sprite';

Editor.prototype.palettes.init = function() {
  console.log('palette init');

  var self = this;

  channel.subscribe('app.palette.select', function(data, envelope) {
    self.selected = data.palette;
  });
};

Editor.prototype.palettes.buildAuto = function() {
  var palette = [];
  file.pixels.forEach(function(pixel) {
    var color = Color().rgb(pixel.r, pixel.g, pixel.b).hexString();
    palette.push(color);
  });
  this.available.sprite.colors = _.uniq(palette, false);
};

Editor.prototype.palettes.available = {
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
Editor.prototype.selection = {};

Editor.prototype.selection.bounds = false;

Editor.prototype.selection.pixels = [];



Editor.prototype.selection.init = function(editor) {

  var self = this;

  function saveAndClearPixels() {
    // merge editor.selection.pixels back to editor.pixels
    self.pixels.forEach(function(pixel) {
      editor.pixels.push(pixel);
    });

    editor.pixels = _.unique(editor.pixels, function(p) { return p.layer+','+p.x+','+p.y });
    self.pixels = [];
  };

  function pixelHasBeenSelected(pixel) {
    return self.contains(pixel) && pixel.layer == editor.layers.selected;
  };

  channel.subscribe('app.tool.select', function(data, envelope) {
    if(editor.selection.isActive) {
      switch(data.tool) {
        case 'RectangularSelectionTool':
          saveAndClearPixels();
          break;
        default:
          // move selected pixels from editor.pixels to editor.selection.pixels
          self.pixels = _.filter(editor.pixels, pixelHasBeenSelected);
          editor.pixels = _.reject(editor.pixels, pixelHasBeenSelected);
          break;
      }
    }
  });

  channel.subscribe('stage.selection.start', function(data, envelope) {
    self.bounds = {
      start: data.point
    };
  });

  channel.subscribe('stage.selection.end', function(data, envelope) {
    self.bounds = { // reset self selection to remove cursor property as it's no longer needed
      start: self.bounds.start,
      end: data.point
    };

    // switch start & end if start is more "lower right" than end
    // makes iterating over the selection easier later
    if(self.bounds.start.x > self.bounds.end.x
    || self.bounds.start.y > self.bounds.end.y) {
      var temp = self.bounds.start;
      self.bounds.start = self.bounds.end;
      self.bounds.end = temp;
    }
  });

  channel.subscribe('stage.selection.resize', function(data, envelope) {
    self.bounds.cursor = data.point;
  });

  channel.subscribe('stage.selection.update', function(data, envelope) {
    self.bounds.distance = data.distance;
  });

  channel.subscribe('stage.selection.move.bounds', function(data, envelope) {
    self.bounds = {
      start: new Point(
        self.bounds.start.x + data.distance.x,
        self.bounds.start.y + data.distance.y
      ),
      end: new Point(
        self.bounds.end.x + data.distance.x,
        self.bounds.end.y + data.distance.y
      )
    };
  });

  channel.subscribe('stage.selection.move.pixels', function(data, envelope) {
    self.pixels.forEach(function(p) {
      p.x += data.distance.x;
      p.y += data.distance.y;
    });
  });

  channel.subscribe('stage.selection.clear', function(data, envelope) {
    self.bounds = false;
    saveAndClearPixels();
  });
};

Editor.prototype.selection.contains = function(point) {
  if(this.isActive)
    return point.x >= this.bounds.start.x
        && point.x <= this.bounds.end.x
        && point.y >= this.bounds.start.y
        && point.y <= this.bounds.end.y;
};

Object.defineProperty(Editor.prototype.selection, 'isActive', {
  enumerable: true,
  configurable: false,
  get: function() {
    return this.bounds.start instanceof Point
        && this.bounds.end instanceof Point;
  }
});

Object.defineProperty(Editor.prototype.selection, 'isResizing', {
  enumerable: true,
  configurable: false,
  get: function() {
    return this.bounds.start instanceof Point
        && this.bounds.cursor instanceof Point;
  }
});

Object.defineProperty(Editor.prototype.selection, 'isMoving', {
  enumerable: true,
  configurable: false,
  get: function() {
    return this.bounds.start instanceof Point
        && this.bounds.end instanceof Point
        && this.bounds.distance instanceof Point;
  }
});
Editor.prototype.brightnessTool = {};

Editor.prototype.brightnessTool.mode = 'lighten';
Editor.prototype.brightnessTool.intensity = 10;

Editor.prototype.brightnessTool.init = function() {
  var self = this;

  channel.subscribe('app.brightnesstool.mode.select', function(data, envelope) {
    self.mode = data.mode;
  });

  channel.subscribe('app.brightnesstool.intensity.select', function(data, envelope) {
    self.intensity = data.intensity;
  });
};
var Hotkeys = function(editor) {

  this.actions = {
    selectBrushTool: {
      key: 'b',
      action: function() { channel.publish('app.tool.select', {tool: 'BrushTool'}); }
    },
    selectEraserTool: {
      key: 'e',
      action: function() { channel.publish('app.tool.select', {tool: 'EraserTool'}); }
    },
    selectEyedropperTool: {
      key: 'i',
      action: function() { channel.publish('app.tool.select', {tool: 'EyedropperTool'}); }
    },
    selectRectangularSelectionTool: {
      key: 'm',
      action: function() { channel.publish('app.tool.select', {tool: 'RectangularSelectionTool'}); }
    },
    selectPaintBucketTool: {
      key: 'p',
      action: function() { channel.publish('app.tool.select', {tool: 'PaintBucketTool'}); }
    },
    selectBrightnessTool: {
      key: 'o',
      action: function() { channel.publish('app.tool.select', {tool: 'BrightnessTool'}); }
    },
    selectMoveTool: {
      key: 'v',
      action: function() { channel.publish('app.tool.select', {tool: 'MoveTool'}); }
    },
    selectZoomTool: {
      key: 'z',
      action: function() { channel.publish('app.tool.select', {tool: 'ZoomTool'}); }
    },
    toggleGrid: {
      key: 'g',
      action: function() { channel.publish('stage.grid.toggle', {grid: !editor.grid}); }
    },
    dropSelection: {
      key: ['ctrl+d', 'command+d'],
      action: function() { channel.publish('stage.selection.clear'); }
    },









    arrowUp: {
      key: ['up'],
      action: function() {

        var distance = new Point(0, -1);

        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color, 1);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'BrightnessTool':
            var intensity = editor.brightnessTool.intensity+1;
            if(intensity <= 100) channel.publish('app.brightnesstool.intensity.select', {intensity: intensity});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom+1;
            if(zoom <= 50) channel.publish('stage.zoom.select', {zoom: zoom});
            break;
        }
      }
    },
    arrowRight: {
      key: ['right'],
      action: function() {

        var distance = new Point(1, 0);

        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.rotate(1);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'BrightnessTool':
            channel.publish('app.brightnesstool.mode.select', {mode: 'darken'});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom+1;
            if(zoom <= 50) channel.publish('stage.zoom.select', {zoom: zoom});
            break;
        }
      }
    },
    arrowDown: {
      key: ['down'],
      action: function() {

        var distance = new Point(0, 1);

        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color, -1);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'BrightnessTool':
            var intensity = editor.brightnessTool.intensity-1;
            if(intensity >= 1) channel.publish('app.brightnesstool.intensity.select', {intensity: intensity});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom-1;
            if(zoom >= 1) channel.publish('stage.zoom.select', {zoom: zoom});
            break;
        }
      }
    },
    arrowLeft: {
      key: ['left'],
      action: function() {

        var distance = new Point(-1, 0);

        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.rotate(-1);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'BrightnessTool':
            channel.publish('app.brightnesstool.mode.select', {mode: 'lighten'});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
          case 'ZoomTool':
            var zoom = editor.zoom-1;
            if(zoom >= 1) channel.publish('stage.zoom.select', {zoom: zoom});
            break;
        }
      }
    },









    shiftArrowUp: {
      key: ['shift+up'],
      action: function() {
        var distance = new Point(0, -10);
        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color, 10);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
        }
      }
    },
    shiftArrowRight: {
      key: ['shift+right'],
      action: function() {
        var distance = new Point(10, 0);
        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.rotate(10);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
        }
      }
    },
    shiftArrowDown: {
      key: ['shift+down'],
      action: function() {
        var distance = new Point(0, 10);
        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = changeColorLightness(editor.color, -10);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
        }
      }
    },
    shiftArrowLeft: {
      key: ['shift+left'],
      action: function() {
        var distance = new Point(-10, 0);
        switch(editor.tool) {
          case 'BrushTool':
          case 'PaintBucketTool':
            var color = editor.color.rotate(-10);
            channel.publish('app.color.select', {color: color.hexString()});
            break;
          case 'RectangularSelectionTool':
            if(editor.selection.isActive) channel.publish('stage.selection.move.bounds', {distance: distance});
            break;
          case 'MoveTool':
            if(editor.selection.isActive) {
              channel.publish('stage.selection.move.pixels', {distance: distance});
              channel.publish('stage.selection.move.bounds', {distance: distance});
            }
            else channel.publish('stage.tool.move', {distance: distance});
            stage.layer.refresh();
            break;
        }
      }
    },
  };

  var self = this;

  Object.keys(this.actions).map(function(action) {
    var a = self.actions[action];
    Mousetrap.bind(a.key, a.action);
  });
};
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
  this.data.layer = editor.layers.selected;
  this.data.palette = editor.palettes.selected;
  this.data.color = editor.color.hexString();
  this.data.grid = editor.grid;
  this.data.zoom = editor.zoom;
  this.data.selection = {
    bounds: editor.selection.bounds,
    pixels: editor.selection.pixels,
  };
  this.data.brightnessTool = {
    mode: editor.brightnessTool.mode,
    intensity: editor.brightnessTool.intensity,
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

  editor.tool = this.data.tool;
  editor.frame = this.data.frame;
  editor.layers.selected = this.data.layer;
  editor.palettes.selected = this.data.palette;
  editor.color = new Color(this.data.color);
  editor.grid = this.data.grid;
  editor.zoom = this.data.zoom;
  editor.selection.bounds = restoreSelectionBounds.call(this);
  editor.selection.pixels = this.data.selection.pixels;
  editor.brightnessTool.mode = this.data.brightnessTool.mode;
  editor.brightnessTool.intensity = this.data.brightnessTool.intensity;
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
var FoldableMixin = {
  getInitialState: function() {
    return ({
      folded: false
    });
  },
  componentDidMount: function() {
    var self = this,
        handle = this.getDOMNode().querySelector('.foldable-handle'),
        fold = this.getDOMNode().querySelector('.foldable-fold');

    function doFold(isFolded) {
      if(isFolded) {
        fold.style.display = 'none';
        handle.classList.add('folded');
      }
      else {
        fold.style.display = 'block';
        handle.classList.remove('folded');
      }
    };

    handle.onclick = function() {
      workspace.data.folds[self.props.fold] = !self.props.workspace.data.folds[self.props.fold];
      doFold(workspace.data.folds[self.props.fold]);
      workspace.save();
      channel.publish('app.box.toggle');
    };

    doFold(self.props.workspace.data.folds[self.props.fold]);
  },
  componentWillUnmount: function() {
    var handle = this.getDOMNode().querySelector('.foldable-handle');
    handle.onclick = null;
  }
};
// Use only in <canvas> components
var CopyFrameMixin = {
  propTypes: {
    frame: React.PropTypes.number.isRequired
  },
  componentDidMount: function() {
    channel.subscribe('stage.frame.update', this.prepareRefresh);
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      this.drawFrame();
      this.setState({needsRefresh: false});
    }
  },
  drawFrame: function() {
    var w = this.getDOMNode().clientWidth,
        h = this.getDOMNode().clientHeight,
        sourceCanvas = document.getElementById('OffscreenFrameCanvas-'+this.props.frame);

    this.getDOMNode().width = this.getDOMNode().width; // clear canvas
    this.getDOMNode().getContext('2d').webkitImageSmoothingEnabled = false;
    this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0, w, h);
  },
};
var StageBoxCanvasMixin = {
  clear: function() {
    var canvas = this.getDOMNode();
    canvas.width = canvas.width;
  },
};
var App = React.createClass({
  render: function() {

    var totalFrames = this.props.file.frames.x * this.props.file.frames.y,
        frames = [];

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <div id="App">
        <div className="area top">
          <ToolContainer editor={this.props.editor} />
        </div>
        <div className="area left">
          <ToolBox editor={this.props.editor} />
        </div>
        <div className="area center">
          <StageBox file={this.props.file} editor={this.props.editor} pixel={this.props.pixel}/>
        </div>
        <div className="area right">
          <div id="layerboxhelper">
            <PreviewBox file={this.props.file} editor={this.props.editor} workspace={this.props.workspace} fold="preview" />
            <FrameBox file={this.props.file} editor={this.props.editor} workspace={this.props.workspace} fold="frames" />
          </div>
          <LayerBox file={this.props.file} editor={this.props.editor} workspace={this.props.workspace} fold="layers" />
        </div>
        <div className="area bottom">
          <StatusBar editor={this.props.editor} />
        </div>
        <div className="area offscreen">
          {frames.map(function(frame) {
            var id = 'OffscreenFrameCanvas-'+frame;
            return (
              <OffscreenFrameCanvas key={id} frame={frame} file={this.props.file} editor={this.props.editor} />
            );
          }, this)}

          <SelectionPattern editor={this.props.editor} />
        </div>
      </div>
    );
  },
  componentDidMount: function() {

    channel.subscribe('stage.grid.toggle', this.updateProps);
    channel.subscribe('stage.zoom.select', this.updateProps);

    channel.subscribe('app.tool.select', this.updateProps);
    channel.subscribe('app.color.select', this.updateProps);
    channel.subscribe('app.frame.select', this.updateProps);
    channel.subscribe('app.palette.select', this.updateProps);
    channel.subscribe('app.box.toggle', this.updateProps);
    channel.subscribe('app.layer.select', this.updateProps);

    channel.subscribe('app.brightnesstool.mode.select', this.updateProps);
    channel.subscribe('app.brightnesstool.intensity.select', this.updateProps);

    //channel.subscribe('app.layer.add', this.updateProps);

    channel.subscribe('file.layer.opacity.select', this.updateProps);
    channel.subscribe('file.layer.visibility.toggle', this.updateProps);
    channel.subscribe('file.layer.name.select', this.updateProps);


    channel.subscribe('stage.pixel.select', this.updateProps);
    channel.subscribe('stage.tool.move', this.updateProps);
  },
  updateProps: function() {
    //console.log('updating App props');
    this.setProps({
      editor: editor,
      file: file
    });
  },
});
var ToolContainer = React.createClass({
  render: function() {
    return window[this.props.editor.tool](this.props);
  }
});
var Palette = React.createClass({
  getInitialState: function() {
    return {
      resetScroll: false,
    };
  },
  render: function() {

    var palettes = this.props.editor.palettes.available,
        palette = palettes[this.props.editor.palettes.selected];

    return (
      <div className="palette">
        <div className="switch" onClick={this.showPalettes}>
          <i className="icon flaticon-color1"/>
          <i className="switch-arrow flaticon-little9"/>
          <div className="name">{palette.short}</div>
          <ul ref="paletteList" className="list">
            {Object.keys(palettes).map(function(paletteKey) {
              var p = palettes[paletteKey];
              return (
                <li key={paletteKey} data-palette={paletteKey} onClick={this.selectPalette}>{p.title} ({p.colors.length} colours)</li>
              );
            }, this)}
          </ul>
        </div>
        <button ref="buttonScrollLeft" className="scroll left" onClick={this.scrollLeft}>
          <i className="flaticon-arrow85"/>
        </button>
        <div className="outer">
          <div className="inner">
            {palette.colors.map(function(color) {
              return (
                <PaletteSwatch key={color} color={color} />
              );
            }, this)}
          </div>
        </div>
        <button ref="buttonScrollRight" className="scroll right" onClick={this.scrollRight}>
          <i className="flaticon-mini7"/>
        </button>
      </div>
    );
  },
  componentDidMount: function() {
    this.setInnerWidth();
    this.resetScroll();

    this.subscriptions = [
      channel.subscribe('app.palette.select', this.prepareResetScroll)
    ];
  },
  componentDidUpdate: function() {
    this.setInnerWidth();

    if(this.state.resetScroll) {
      this.resetScroll();
      this.setState({resetScroll:false});
    }
  },
  componentDidUnmount: function() {
    this.subscriptions.forEach(function(subscription) {
      subscription.unsubscribe();
    });
  },
  getOuterWidth: function() {
    return this.getDOMNode().querySelector('.outer').clientWidth;
  },
  getInnerWidth: function() {
    var swatchWidth = 28,
        swatches = NodeList2Array(this.getDOMNode().querySelectorAll('.inner .colorswatch')).length;
    return swatchWidth*swatches;
  },
  setInnerWidth: function() {
    var swatchWidth = 28,
        ow = this.getOuterWidth(),
        swatches = NodeList2Array(this.getDOMNode().querySelectorAll('.inner .colorswatch')).length,
        swatchesVisible = Math.floor(ow/swatchWidth),
        pages = Math.ceil(swatches/swatchesVisible),
        diff = ow - (swatchesVisible*swatchWidth);

    this.getDOMNode().querySelector('.inner').style.width = ((swatchesVisible*swatchWidth*pages)+diff)+'px';
  },
  getScrollPosition: function() {
    return this.getDOMNode().querySelector('.outer').scrollLeft;
  },
  setScrollPosition: function(x) {
    this.getDOMNode().querySelector('.outer').scrollLeft = x;
  },
  scrollTo: function(x) {
    var interval,
        self = this,
        start = this.getScrollPosition(),
        distance = x - start,
        duration = 200,
        animationType = 'sineInOut',
        loop = false,
        tween = new Tween(start, distance, duration, animationType, loop);

    if(x == 0) this.refs.buttonScrollLeft.getDOMNode().style.visibility = 'hidden';
    else this.refs.buttonScrollLeft.getDOMNode().style.visibility = 'visible';

    var iw = this.getInnerWidth(),
        ow = this.getOuterWidth(),
        w = iw - ow,
        swatchWidth = 28,
        swatches = NodeList2Array(this.getDOMNode().querySelectorAll('.inner .colorswatch')).length,
        swatchesVisible = Math.floor(ow/swatchWidth),
        pages = Math.ceil(swatches/swatchesVisible);

    if(pages == 1) this.refs.buttonScrollRight.getDOMNode().style.visibility = 'hidden';
    else {
      if(x >= w) this.refs.buttonScrollRight.getDOMNode().style.visibility = 'hidden';
      else this.refs.buttonScrollRight.getDOMNode().style.visibility = 'visible';
    }

    (function animate() {
      if(!tween.expired()) {
        self.setScrollPosition(tween.getValue());
        setTimeout(animate, 1);
      }
    })();
  },
  scrollLeft: function() {
    var swatchWidth = 28,
        ow = this.getOuterWidth(),
        scroll = this.getScrollPosition(),
        swatchesVisible = Math.floor(ow/swatchWidth),
        target = scroll - (swatchWidth*swatchesVisible);

    if(target < 0) target = 0;
    this.scrollTo(target);
  },
  scrollRight: function() {
    var swatchWidth = 28,
        ow = this.getOuterWidth(),
        scroll = this.getScrollPosition(),
        swatches = NodeList2Array(this.getDOMNode().querySelectorAll('.inner .colorswatch')).length,
        swatchesVisible = Math.floor(ow/swatchWidth),
        target = scroll + (swatchWidth*swatchesVisible);

    this.scrollTo(target);
  },
  prepareResetScroll: function(palette) {
    if(this.isMounted()) this.setState({resetScroll: true});
  },
  resetScroll: function() {
    this.scrollTo(0);
  },
  showPalettes: function() {
    this.refs.paletteList.getDOMNode().style.display = 'block';
  },
  hidePalettes: function() {
    this.refs.paletteList.getDOMNode().style.display = 'none';
  },
  selectPalette: function(event) {
    var palette = event.currentTarget.getAttribute('data-palette');
    this.hidePalettes();
    channel.publish('app.palette.select', {palette: palette});
    return false;
  },
});
var PaletteSwatch = React.createClass({
  propTypes: {
    color: React.PropTypes.string.isRequired,
  },
  render: function() {
    return (
      <div
        className="colorswatch"
        style={{background: this.props.color}}
        title={this.props.color}
        onClick={this.select} />
    );
  },
  select: function() {
    channel.publish('app.color.select', {color: this.props.color});
  }
});
var BrushTool = React.createClass({
  render: function() {
    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon flaticon-small23"/>
        <input type="color" id="Brush-Colorpicker" className="ColorSwatch" value={editor.color.hexString()} onChange={this.dispatchColorSelected} title={editor.color.hexString()} />
        <span className="spacer"/>
        <Palette editor={this.props.editor} />
      </div>
    );
  },
  dispatchColorSelected: function(event) {
    var color = event.target.value;
    channel.publish('app.color.select', {color: color});
  }
});
var EraserTool = React.createClass({
  render: function() {
    return (
      <div id="Eraser-Tool" className="ToolComponent">
        <i className="icon flaticon-double31" style={{position:'relative', left: '0.25em'}}></i>

        <span className="hint">Click a pixel to erase it.</span>
      </div>
    );
  }
});
var EyedropperTool = React.createClass({
  render: function() {
    return (
      <div id="Eyedropper-Tool" className="ToolComponent">
        <i className="icon flaticon-eyedropper2"></i>
        <div id="EyedropperSwatch" className="colorswatch" style={{background: this.props.editor.pixelColor.rgbaString()}}></div>
        <ul>
          <li>Hex: {this.props.editor.pixelColor.alpha() == 0 ? '': this.props.editor.pixelColor.hexString()}</li>
          <li>RGB: {this.props.editor.pixelColor.alpha() == 0 ? '': this.props.editor.pixelColor.red()+', '+this.props.editor.pixelColor.green()+', '+this.props.editor.pixelColor.blue()}</li>
        </ul>
        <span className="spacer"></span>
        <span className="hint">Click any non-transparent pixel to pick its color.</span>

      </div>
    );
  }
});
var RectangularSelectionTool = React.createClass({
  render: function() {
    return (
      <div id="RectangularSelection-Tool" className="ToolComponent">
        <i className="icon flaticon-selection7"></i>

        <span className="hint">Select some pixels to work with!</span>
      </div>
    );
  }
});
var PaintBucketTool = React.createClass({
  render: function() {
    return (
      <div id="PaintBucket-Tool" className="ToolComponent">
        <i className="icon flaticon-paint2"/>
        <input type="color" id="PaintBucket-Colorpicker" className="ColorSwatch" value={editor.color.hexString()} onChange={this.dispatchColorSelected} title={editor.color.hexString()} />
        <span className="spacer"/>
        <Palette editor={this.props.editor} />
      </div>
    );
  },
  dispatchColorSelected: function(event) {
    var color = event.target.value;
    channel.publish('app.color.select', {color: color});
  }
});
var BrightnessTool = React.createClass({
  render: function() {

    var lClass = 'small transparent active',
        lDisabled = true,
        dClass = 'small',
        dDisabled = false;

    if(this.props.editor.brightnessTool.mode == 'darken') {
        lClass = 'small',
        lDisabled = false,
        dClass = 'small transparent active',
        dDisabled = true;
    }

    return (
      <div id="Brightness-Tool" className="ToolComponent">
        <i className="icon flaticon-sun4"></i>
        <button onClick={this.selectLightenTool} className={lClass} disabled={lDisabled} title="Lighten pixels"><i className="flaticon-dark26"></i></button>
        <button onClick={this.selectDarkenTool} className={dClass} disabled={dDisabled} title="Darken pixels"><i className="flaticon-clear3"></i></button>


        <input type="range" min="1" max="100" className="brightness-slider" value={this.props.editor.brightnessTool.intensity} onChange={this.setIntensity} />
        <span>{capitaliseFirstLetter(this.props.editor.brightnessTool.mode)} by</span>
        <input type="number" min="1" max="100" className="brightness-number" value={this.props.editor.brightnessTool.intensity} onChange={this.setIntensity} />
        <span>%</span>


        <span className="spacer"></span>
        <span className="hint">Make existing pixels brighter or darker with this brush.</span>
      </div>
    );
  },
  selectLightenTool: function() {
    channel.publish('app.brightnesstool.mode.select', {mode: 'lighten'});
  },
  selectDarkenTool: function() {
    channel.publish('app.brightnesstool.mode.select', {mode: 'darken'});
  },
  setIntensity: function(event) {
    var newIntensity = parseInt(event.target.value);
    channel.publish('app.brightnesstool.intensity.select', {intensity: newIntensity});
  }

});
var MoveTool = React.createClass({
  render: function() {
    return (
      <div id="Move-Tool" className="ToolComponent">
        <i className="icon flaticon-move11"></i>

        <span className="hint">Move pixels of a layer by dragging.</span>
      </div>
    );
  }
});
var ZoomTool = React.createClass({
  render: function() {

    var zoom = editor.zoom;
    return (
      <div id="Zoom-Tool" className="ToolComponent">
        <i className="icon flaticon-magnifier5"></i>
        <button onClick={this.zoomIn} className="small" title="Zoom in"><i className="flaticon-plus25"></i></button>
        <button onClick={this.zoomOut} className="small" title="Zoom out"><i className="flaticon-minus18"></i></button>
        <input type="range" min="1" max="50" className="zoom-slider" value={this.props.editor.zoom} onChange={this.dispatchZoomChanged} />
        <span>Zoom &times;</span>
        <input type="number" min="1" max="50" className="zoom-number" value={this.props.editor.zoom} onChange={this.dispatchZoomChanged} />
        <button onClick={this.fitToScreen} className="small">Fit to screen</button>
        <span className="spacer"></span>
        <span className="hint">A pixel in your sprite is now {this.props.editor.zoom} pixels on your screen.</span>
      </div>
    );
  },
  dispatchZoomChanged: function(event, zoom) {
    zoom = _.isNull(event) ? zoom : event.target.value;
    channel.publish('stage.zoom.select', {zoom: zoom});
  },
  zoomIn: function() {
    if(editor.zoom+1 <= 50) this.dispatchZoomChanged(null, editor.zoom+1);
  },
  zoomOut: function() {
    if(editor.zoom-1 >= 1 ) this.dispatchZoomChanged(null, editor.zoom-1);
  },
  fitToScreen: function() {
    var zoom = Math.floor((window.innerHeight - editor.offset.top - editor.offset.bottom)/file.size.height);
    if((file.size.width*zoom) > (window.innerWidth - editor.offset.left - editor.offset.right)) {
      zoom = Math.floor((window.innerWidth - editor.offset.left - editor.offset.right)/file.size.width);
    }
    this.dispatchZoomChanged(null, zoom);
  }
});
var StageBox = React.createClass({
  getInitialState: function() {
    return {
      needsRefresh: false,
      mousedown: false,
      mousedownPoint: new Point(0, 0),
      last: null, // we need to record the mousedown timestamp because of a chrome bug,
                  // see https://code.google.com/p/chromium/issues/detail?id=161464
                  // and http://stackoverflow.com/questions/14538743/what-to-do-if-mousemove-and-click-events-fire-simultaneously
    };
  },
  render: function() {

    var w = this.props.file.size.width*this.props.editor.zoom,
        h = this.props.file.size.height*this.props.editor.zoom,
        centerAreaWidth = window.innerWidth - editor.offset.left - editor.offset.right,
        centerAreaHeight = window.innerHeight - editor.offset.top - editor.offset.bottom;

    var css = {
      width: w,
      height: h,
    };

    if( w > centerAreaWidth ) css.left = 0;
    else css.left = (centerAreaWidth - w)/2;

    if( h > centerAreaHeight ) css.top = 0;
    else css.top = (centerAreaHeight - h)/2;

    return (
      <div id="StageBox"
        style={css}
        onMouseDown={this.mousedown}
        onMouseMove={this.mousemove}
        onMouseUp={this.mouseup}>

        <StageBoxCursorCanvas width={w} height={h} editor={this.props.editor} />
        <StageBoxSelectionCanvas width={w} height={h} editor={this.props.editor} />
        <StageBoxGridCanvas width={w} height={h} editor={this.props.editor} />

        {this.props.file.layers.map(function(layer) {
          var id = 'StageBoxLayer-'+layer.id;
          var visible = (layer.frame == this.props.editor.frame) ? true : false;
          return (
            <StageBoxLayer key={id} width={w} height={h} layer={layer} visible={visible} editor={this.props.editor} />
          );
        }, this)}
      </div>
    );
  },
  componentDidMount: function() {
    this.subscriptions = [
      channel.subscribe('app.frame.select', this.prepareRefresh),
      channel.subscribe('stage.zoom.select', this.prepareRefresh),
    ];
  },
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      stage.frame.refresh();
      this.setState({needsRefresh: false});
    }
  },

  mousedown: function(event) {

    event = event.nativeEvent;

    var point = this.getWorldCoordinates(event);

    switch(this.props.editor.tool) {

      case 'BrushTool':
        this.useBrushTool();
        break;

      case 'EraserTool':
        this.useEraserTool();
        break;

      case 'BrightnessTool':
        this.useBrightnessTool();
        break;

      case 'RectangularSelectionTool':
        this.startRectangularSelection(point);
        break;
    }

    this.setState({mousedown: true, mousedownPoint: point, last: event.timeStamp});
  },

  mousemove: function(event) {

    event = event.nativeEvent;

    this.getLayerPixelColor(event);

    var point = this.getWorldCoordinates(event),
        distance = this.getMouseDownDistance();

    if(event.timeStamp > this.state.last + 10) {
      channel.publish('stage.pixel.select', {point: point});
    }

    if(this.state.mousedown === true) {

      switch(this.props.editor.tool) {

        case 'BrushTool':
          this.useBrushTool();
          break;

        case 'EraserTool':
          this.useEraserTool();
          break;

        case 'RectangularSelectionTool':
          if(editor.selection.isActive) this.updateRectangularSelection(distance);
          else this.resizeRectangularSelection(point);
          break;

        case 'BrightnessTool':
          this.useBrightnessTool();
          break;

        case 'MoveTool':
          this.useMoveTool();
          break;
      }
    }
  },

  mouseup: function(event) {

    event = event.nativeEvent;

    var point = this.getWorldCoordinates(event),
        distance = this.getMouseDownDistance(),
        selectionActive = editor.selection.isActive;

    this.setState({mousedown: false});

    switch(this.props.editor.tool) {

      case 'EyedropperTool':
        this.useEyedropperTool();
        break;

      case 'RectangularSelectionTool':
        this.endRectangularSelection(point, distance);
        break;

      case 'PaintBucketTool':
        this.usePaintBucketTool(point);
        break;

      case 'MoveTool':
        if(editor.selection.isActive) {
          channel.publish('stage.selection.move.pixels', {distance: distance});
          channel.publish('stage.selection.move.bounds', {distance: distance});
        }
        else channel.publish('stage.tool.move', {distance: distance});
        break;
    }
  },


  getLayerPixelColor: function(event) {
    var layer = file.getLayerById(this.props.editor.layers.selected),
        ctx = document.getElementById('StageBoxLayer-'+layer.id).getContext('2d'),
        px = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data,
        color = Color({r:px[0], g:px[1], b:px[2], a:px[3]});

    editor.layerPixelColor = color;
  },
  getWorldCoordinates: function(event) {
    return new Point(
      Math.ceil(event.layerX/this.props.editor.zoom),
      Math.ceil(event.layerY/this.props.editor.zoom)
    );
  },
  getMouseDownDistance: function() {
    return new Point(
      editor.pixel.x - this.state.mousedownPoint.x,
      editor.pixel.y - this.state.mousedownPoint.y
    );
  },







  useBrushTool: function() {

    if(isLayerVisible()) {
      if(!editor.selection.isActive) stage.pixel.fill();
      else { // restrict to selection
        if(editor.selection.contains(editor.pixel)) stage.pixel.fill();
      }
    }
    //else {
    //  this.mouseup(); // prevent additional alerts
    //  alert('You are trying to paint on an invisible layer. Please make the layer visible and try again.');
    //}
  },
  useEraserTool: function() {
    if(isLayerVisible()) {
      if(!editor.selection.isActive) stage.pixel.clear();
      else { // restrict to selection
        if(editor.selection.contains(editor.pixel)) stage.pixel.clear();
      }
    }
    // else {
      // this.mouseup();  // prevent additional alerts
      // alert('You are trying to erase on an invisible layer. Please make the layer visible and try again.');
    // }
  },
  useEyedropperTool: function() {
    if(editor.pixelColor.alpha() == 0) return;
    channel.publish('app.tool.select', {tool: 'BrushTool'});
    channel.publish('app.color.select', {color: editor.pixelColor.hexString()});
  },
  usePaintBucketTool: function(point) {
    if(isLayerVisible()) {
      if(editor.selection.isActive) {
        if(editor.selection.contains(point)) channel.publish('stage.tool.paintbucket', {point: point});
      }
      else channel.publish('stage.tool.paintbucket', {point: point});
    }
  },
  useBrightnessTool: function() {
    if(isLayerVisible()) {

      var px = _.findWhere(editor.pixels, {layer: editor.layers.selected, x: editor.pixel.x, y: editor.pixel.y }),
          pixelExists = !_.isUndefined(px);

      if(pixelExists) {
        if(!editor.selection.isActive) {
          if(editor.brightnessTool.mode == 'lighten') stage.pixel.lighten();
          else if(editor.brightnessTool.mode == 'darken') stage.pixel.darken();
        }
        else { // restrict to selection
          if(editor.selection.contains(editor.pixel)) {
            if(editor.brightnessTool.mode == 'lighten') stage.pixel.lighten();
            else if(editor.brightnessTool.mode == 'darken') stage.pixel.darken();
          }
        }
      }
    }
    // else {
      // this.mouseup(); // prevent additional alerts
      // alert('You are trying to paint on an invisible layer. Please make the layer visible and try again.');
    // }
  },
  useMoveTool: function() {

    var layer = editor.layers.selected,
        distance = this.getMouseDownDistance(),
        canvas = document.getElementById('StageBoxLayer-'+layer);

    canvas.width = canvas.width;

    if(editor.selection.isActive) {

      this.updateRectangularSelection(distance);

      editor.selection.pixels.forEach(function(pixel) {

        var color = new Color('rgb('+pixel.r+', '+pixel.g+', '+pixel.b+')');

        //if(pixel.layer == layer) {
          var target = wrapPixel(pixel, distance);
          stage.pixel.fill(layer, target.x, target.y, color);
        //}
        //else stage.pixel.fill(layer, pixel.x, pixel.y, color);
      });

      editor.pixels.forEach(function(pixel) {
        if(pixel.layer == layer) {
          var color = new Color('rgb('+pixel.r+', '+pixel.g+', '+pixel.b+')');
          stage.pixel.fill(layer, pixel.x, pixel.y, color);
        }
      });
    }
    else {
      editor.pixels.forEach(function(pixel) {
        if(pixel.layer == layer) {
          var color = new Color('rgb('+pixel.r+', '+pixel.g+', '+pixel.b+')'),
              target = wrapPixel(pixel, distance);
          stage.pixel.fill(layer, target.x, target.y, color);
        }
      });
    }
  },

  startRectangularSelection: function(point) {
    if(!editor.selection || !editor.selection.contains(point)) {
      channel.publish('stage.selection.clear');
      channel.publish('stage.selection.start', {point: point});
    }
  },
  resizeRectangularSelection: function(point) {
    channel.publish('stage.selection.resize', {point: point});
  },
  updateRectangularSelection: function(distance) {
    channel.publish('stage.selection.update', {distance: distance});
  },
  endRectangularSelection: function(point, distance) {
    if(editor.selection.isActive) {
      channel.publish('stage.selection.move.bounds', {distance: distance});
    }
    else {
      if(_.isEqual(point, this.state.mousedownPoint))
        channel.publish('stage.selection.clear');
      else
        channel.publish('stage.selection.end', {point: point});
    }
  },

});
var StageBoxCursorCanvas = React.createClass({
  mixins: [StageBoxCanvasMixin],
  render: function() {
    return (
      <canvas id="StageBoxCursorCanvas" className="Layer" width={this.props.width} height={this.props.height} />
    );
  },
  componentDidUpdate: function() {
    this.clear();
    this.drawPixelCursor();
  },
  drawPixelCursor: function() {
    var zoom = this.props.editor.zoom,
        x = this.props.editor.pixel.x,
        y = this.props.editor.pixel.y;

    if(x == 0 && y == 0) return;

    var canvas = this.getDOMNode(),
        ctx = canvas.getContext('2d');

    ctx.strokeStyle="#FF0000";

    var left = (x*zoom)-zoom+0.5,
        right = (x*zoom)+0.5,
        top = (y*zoom)-zoom+0.5,
        bottom = (y*zoom)+0.5;

    if(zoom < 3) {
      right++;
      bottom++;
    }

    if(x > 1) {
      ctx.beginPath();
      ctx.moveTo(left, 0);
      ctx.lineTo(left, canvas.height);
      ctx.stroke();
    }

    if(x < (canvas.width/zoom)) {
      ctx.beginPath();
      ctx.moveTo(right, 0);
      ctx.lineTo(right, canvas.height);
      ctx.stroke();
    }

    if(y > 1) {
      ctx.beginPath();
      ctx.moveTo(0, top);
      ctx.lineTo(canvas.width, top);
      ctx.stroke();
    }

    if(y < (canvas.height/zoom)) {
      ctx.beginPath();
      ctx.moveTo(0, bottom);
      ctx.lineTo(canvas.width, bottom);
      ctx.stroke();
    }
  },
});
var StageBoxSelectionCanvas = React.createClass({
  mixins: [StageBoxCanvasMixin],
  render: function() {
    return (
      <canvas id="StageBoxSelectionCanvas" className="Layer" width={this.props.width} height={this.props.height} />
    );
  },

  componentDidUpdate: function(prevProps, prevState) {

    this.clear();

    function drawLastSelection() {
      this.drawSelection(this.props.editor.selection.bounds.start, this.props.editor.selection.bounds.end);
    }

    function moveSelection(distance) {
      var newStart = new Point(
        this.props.editor.selection.bounds.start.x + distance.x,
        this.props.editor.selection.bounds.start.y + distance.y
      );

      var newEnd = new Point(
        this.props.editor.selection.bounds.end.x + distance.x,
        this.props.editor.selection.bounds.end.y + distance.y
      );

      this.drawSelection(newStart, newEnd);
    }

    switch(this.props.editor.tool) {
      case 'RectangularSelectionTool':
        if(this.props.editor.selection.isMoving) moveSelection.call(this, this.props.editor.selection.bounds.distance);
        else if(this.props.editor.selection.isResizing) {
          this.drawSelection(this.props.editor.selection.bounds.start, this.props.editor.selection.bounds.cursor);
        }
        else if(this.props.editor.selection.isActive) drawLastSelection.call(this);
        break;
      case 'MoveTool':
        if(this.props.editor.selection.isMoving) moveSelection.call(this, this.props.editor.selection.bounds.distance);
        else if(this.props.editor.selection.isActive) drawLastSelection.call(this);
        break;
      default:
        if(this.props.editor.selection.isActive) drawLastSelection.call(this);
        break;
    }
  },

  componentDidMount: function() {
    // animate the selection by redrawing the selection pattern from offscreen canvas every 200ms
    var self = this;
    this.interval = setInterval(function() {
      if(editor.selection.isActive) self.forceUpdate();
    }, 200);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  drawSelection: function(start, end) {
    var canvas = this.getDOMNode(),
        zoom = this.props.editor.zoom,
        ctx = canvas.getContext('2d'),
        width = (end.x - start.x),
        height = (end.y - start.y),
        sx,
        sy,
        pattern = ctx.createPattern(document.getElementById('SelectionPattern'), 'repeat');

    if(width >= 0) {
      width++;
      sx = start.x - 1;
    }
    else {
      width--;
      sx = start.x;
    }

    if(height >= 0) {
      height++;
      sy = start.y - 1;
    }
    else {
      height--;
      sy = start.y;
    }

    ctx.strokeStyle = pattern;
    ctx.strokeRect(sx*zoom+0.5, sy*zoom+0.5, width*zoom, height*zoom);
  },
});
var StageBoxGridCanvas = React.createClass({
  mixins: [StageBoxCanvasMixin],
  render: function() {
    return (
      <canvas id="StageBoxGridCanvas" className="Layer" width={this.props.width} height={this.props.height} />
    );
  },
  componentDidUpdate: function() {
    if(this.props.editor.grid === true) {
      this.drawGrid();
    }
    else this.clear();
  },
  drawGrid: function() {
    var canvas = this.getDOMNode(),
        zoom = this.props.editor.zoom;

    if(zoom < 3) return;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#cccccc";

    // vertical lines
    for(var x = zoom+0.5; x < canvas.width; x+= zoom) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // horizontal lines
    for(var y = zoom+0.5; y < canvas.height; y+= zoom) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  },
});
var StageBoxLayer = React.createClass({
  render: function() {

    var cssClass = 'Layer';
    if(this.props.visible === false) cssClass+= ' hidden';

    var display = (this.props.layer.visible === true) ? 'block' : 'none';

    return (
      <canvas
        id={this.props.key}
        className={cssClass}
        width={this.props.width}
        height={this.props.height}
        style={{
          zIndex: this.props.layer.z,
          opacity: this.props.layer.opacity/100,
          display: display,
          width: this.props.width,
          height: this.props.height
        }}>
      </canvas>
    );
  }
});
// clean
var ToolBox = React.createClass({
  render: function() {

    var titles = {
      brushTool: 'Brush Tool ('+hotkeys.actions.selectBrushTool.key+')',
      eraserTool: 'Eraser Tool ('+hotkeys.actions.selectEraserTool.key+')',
      eyedropperTool: 'Eyedropper Tool ('+hotkeys.actions.selectEyedropperTool.key+')',
      rectangularSelectionTool: 'Selection Tool ('+hotkeys.actions.selectRectangularSelectionTool.key+')',
      paintBucketTool: 'Paint Bucket Tool ('+hotkeys.actions.selectPaintBucketTool.key+')',
      brightnessTool: 'Brightness Tool ('+hotkeys.actions.selectBrightnessTool.key+')',
      moveTool: 'Move Tool ('+hotkeys.actions.selectMoveTool.key+')',
      zoomTool: 'Zoom Tool ('+hotkeys.actions.selectZoomTool.key+')',
    };

    return (
      <div id="ToolBox">
        <h4>Tools</h4>
        <div>
          <ToolBoxTool id="BrushTool" title={titles.brushTool} icon="flaticon-small23" editor={this.props.editor} />
          <ToolBoxTool id="EraserTool" title={titles.eraserTool} icon="flaticon-double31" editor={this.props.editor} />
          <ToolBoxTool id="EyedropperTool" title={titles.eyedropperTool} icon="flaticon-eyedropper2" editor={this.props.editor} />
          <ToolBoxTool id="RectangularSelectionTool" title={titles.rectangularSelectionTool} icon="flaticon-selection7" editor={this.props.editor} />
          <ToolBoxTool id="PaintBucketTool" title={titles.paintBucketTool} icon="flaticon-paint2" editor={this.props.editor} />
          <ToolBoxTool id="BrightnessTool" title={titles.brightnessTool} icon="flaticon-sun4" editor={this.props.editor} />
          <ToolBoxTool id="MoveTool" title={titles.moveTool} icon="flaticon-move11" editor={this.props.editor} />
          <ToolBoxTool id="ZoomTool" title={titles.zoomTool} icon="flaticon-magnifier5" editor={this.props.editor} />
        </div>
      </div>
    );
  }
});
var ToolBoxTool = React.createClass({
  render: function() {
    var selected = this.props.id == this.props.editor.tool ? true : false;
    var cssClasses = 'ToolBoxTool transparent';
    if(selected) cssClasses+= ' active';

    return (
      <button
        id={this.props.id}
        className={cssClasses}
        title={this.props.title}
        disabled={selected}
        onClick={this.dispatchToolSelected.bind(this, this.props.id)}>
          <i className={this.props.icon}></i>
      </button>
    );
  },
  dispatchToolSelected: function(tool) {
    channel.publish('app.tool.select', {tool: tool});
  }
});
var PreviewBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    return (
      <div id="PreviewBox" className="box">
        <h4 className="foldable-handle">Preview</h4>
        <div className="foldable-fold">
          <PreviewBoxPreview frame={this.props.editor.frame} file={this.props.file} editor={this.props.editor} />
        </div>
      </div>
    );
  }
});
var PreviewBoxPreview = React.createClass({
  mixins: [CopyFrameMixin],
  render: function() {

    var scale = 1,
        maxWidth = 160,
        maxHeight = 90;

    if(this.props.file.size.width > this.props.file.size.height) {
      // scale to width
      scale = maxWidth/this.props.file.size.width;
    }
    else {
      // scale to height
      scale = maxHeight/this.props.file.size.height;
    }

    var width = this.props.file.size.width*scale,
        height = this.props.file.size.height*scale;

    return (
      <canvas
        id="PreviewBoxPreview"
        width={width}
        height={height}
        style={{
          width: width,
          height: height,
        }}>
      </canvas>
    );
  }
});
var FrameBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    var totalFrames = this.props.file.frames.x * this.props.file.frames.y,
        frames = [],
        frameSize = Math.floor(180/this.props.file.frames.x),
        w = frameSize*this.props.file.frames.x,
        l = (200-w)/2,
        self = this;

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <div id="FrameBox" className="box">
        <h4 className="foldable-handle">Frames</h4>
        <div className="foldable-fold">
          <div id="FrameBoxFrames" style={{width:w, marginLeft:l}}>
          {frames.map(function(frame) {
            var id = 'FrameBoxFrame-'+frame;

            var cssClass = 'frame';
            if(frame == this.props.editor.frame) cssClass+= ' selected';
            if(frame % this.props.file.frames.x == 0) cssClass+= ' right';
            if(frame <= this.props.file.frames.x) cssClass+= ' top';

            var clickHandler = function() {
              channel.publish('app.frame.select', {frame: frame});
            }

            return (
              <div key={id} className={cssClass} style={{width:frameSize, height:frameSize}} onClick={clickHandler}>
                <FrameBoxFrame frame={frame} size={frameSize} file={this.props.file} editor={this.props.editor} />
              </div>
            );
          }, this)}
          </div>
          <div className="actions">
            Frame&nbsp;
            <input type="number" className="frame-number" min="1" max={totalFrames} value={this.props.editor.frame} onChange={this.dispatchFrameSelected} />
            &nbsp;of&nbsp;
            {totalFrames}
          </div>
        </div>
      </div>
    );
  },
  dispatchFrameSelected: function(event) {
    channel.publish('app.frame.select', {frame: event.target.value});
  }
});
var FrameBoxFrame = React.createClass({
  mixins:[CopyFrameMixin],
  render: function() {

    var style = fitCanvasIntoSquareContainer(this.props.file.size.width, this.props.file.size.height, this.props.size);

    return (
      <canvas
        width={style.width}
        height={style.height}
        style={style} />
    );
  }
});
var LayerBox = React.createClass({
  mixins: [FoldableMixin],
  getInitialState: function() {
    return {
      shouldSelectLayer: false
    }
  },
  render: function() {
    var frameLayers = _.where(this.props.file.layers, {frame: this.props.editor.frame});
    var disabled = frameLayers.length <= 1 ? true : false;
    return (
      <div id="LayerBox" className="box">
        <h4 className="foldable-handle">Layers</h4>
        <div className="foldable-fold">
          <div className="layers">
            {this.props.file.layers.map(function(layer) {
              var visible = (layer.frame == this.props.editor.frame) ? true : false;
              var id = 'LayerBoxLayer-'+layer.id;
              return (
                <LayerBoxLayer key={id} layer={layer} size={this.props.file.size} editor={this.props.editor} visible={visible} />
              );
            }, this)}
          </div>
          <div className="actions">
            <button title="New layer above selected layer" onClick={this.dispatchLayerAdded} className="tiny transparent"><i className="flaticon-plus25"></i></button>
            <button title="Delete selected layer" onClick={this.dispatchLayerRemoved} className="tiny transparent" disabled={disabled}><i className="flaticon-minus18"></i></button>
          </div>
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    channel.subscribe('app.layer.add', this.shouldSelectLayer);
    channel.subscribe('app.layer.delete', this.shouldSelectLayer);
  },
  componentDidUpdate: function() {
    if(this.state.shouldSelectLayer !== false) {
      channel.publish('app.layer.select', {layer: this.state.shouldSelectLayer});
      this.setState({ shouldSelectLayer: false });
    }

    var h = this.calculateHeight();
    this.getDOMNode().querySelector('.layers').style.maxHeight = h+'px';
  },
  dispatchLayerAdded: function() {
    channel.publish('file.layer.add', {layer: this.props.editor.layers.selected});
  },
  dispatchLayerRemoved: function() {
    channel.publish('file.layer.delete', {layer: this.props.editor.layers.selected});
  },
  shouldSelectLayer: function(data) {
    this.setState({ shouldSelectLayer: data.layer });
  },
  calculateHeight: function() {
    var areaRightHeight = document.querySelector('.area.right').clientHeight,
        otherBoxesHeight = document.getElementById('layerboxhelper').clientHeight;

    return areaRightHeight - otherBoxesHeight - 47;
  },
});
var LayerBoxLayer = React.createClass({
  render: function() {
    var cssClass = 'LayerBoxLayer';
    if(this.props.layer.id == this.props.editor.layers.selected) cssClass+= ' selected';
    if(this.props.visible === false) cssClass+= ' hidden';

    return (
      <div id={this.props.key} className={cssClass}>
        <div className="visibility">
          <input type="checkbox" checked={this.props.layer.visible} onChange={this.dispatchLayerVisibilityChanged}/>
        </div>
        <div className="preview">
          <LayerBoxLayerPreview ref="preview" layer={this.props.layer.id} size={this.props.size} zoom={this.props.editor.zoom} />
        </div>
        <div className="name">
          <label ref="nameLabel" className="name-label" onClick={this.showNameInput}>{this.props.layer.name}</label>
          <input ref="nameText" className="name-text" type="text" defaultValue={this.props.layer.name} onKeyDown={this.dispatchLayerNameChanged}/>
        </div>
        <input ref="opacitySlider" type="range" className="opacity-slider" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
        <input ref="opacityNumber" type="number" className="opacity-number" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
      </div>
    );
  },
  componentDidMount: function() {
    this.refs.nameText.getDOMNode().addEventListener('blur', this.dispatchLayerNameChanged);
  },
  componentWillUnmount: function() {
    this.refs.nameText.getDOMNode().removeEventListener('blur', this.dispatchLayerNameChanged);
  },
  dispatchLayerVisibilityChanged: function(event) {
    channel.publish('file.layer.visibility.toggle', {layer: this.props.layer.id, visible: event.target.checked});
  },
  dispatchLayerOpacityChanged: function(event) {
    channel.publish('file.layer.opacity.select', {layer: this.props.layer.id, opacity: parseInt(event.target.value)});
  },
  dispatchLayerNameChanged: function(event) {
    if(event.type == 'blur' || (event.nativeEvent.type == 'keydown' && event.nativeEvent.which == 13)) {

      this.refs.nameText.getDOMNode().style.display = 'none';
      this.refs.nameLabel.getDOMNode().style.display = 'block';

      if(!_.isEmpty(event.target.value.trim())) {
        this.refs.nameLabel.getDOMNode().innerHTML = event.target.value;
        channel.publish('file.layer.name.select', {layer: this.props.layer.id, name: event.target.value});
      }
    }
  },
  showNameInput: function() {
    this.refs.nameLabel.getDOMNode().style.display = 'none';
    this.refs.nameText.getDOMNode().style.display = 'block';
    this.refs.nameText.getDOMNode().focus();
  }
});
var LayerBoxLayerPreview = React.createClass({
  propTypes: {
     layer: React.PropTypes.number.isRequired // layer id
  },
  render: function() {

    var style = fitCanvasIntoSquareContainer(this.props.size.width, this.props.size.height, 30);

    return (
      <canvas width={style.width} height={style.height} style={style} onClick={this.dispatchLayerSelected}></canvas>
    );
  },
  componentDidMount: function() {
    this.subscriptions = [
      channel.subscribe('app.frame.select', this.prepareRefresh),
      channel.subscribe('app.box.toggle', this.prepareRefresh),
      channel.subscribe('stage.layer.update', this.prepareRefresh),
    ];
  },
  componentWillUnmount: function() {
    this.subscriptions.forEach(function(subscription) {
      subscription.unsubscribe();
    });
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  dispatchLayerSelected: function() {
    channel.publish('app.layer.select', {layer: this.props.layer});
  },
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      var w = this.getDOMNode().clientWidth,
          h = this.getDOMNode().clientHeight,
          sourceCanvas = document.getElementById('StageBoxLayer-'+this.props.layer);

      this.getDOMNode().width = this.getDOMNode().width; // clear canvas
      this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0, w, h);
      this.setState({needsRefresh: false});
    }
  }
});
var StatusBar = React.createClass({
  render: function() {
    var cssClasses = (this.props.editor.grid === true ? 'active' : '') + ' tiny transparent',
        toggleGridTitle = 'Toggle grid ('+hotkeys.actions.toggleGrid.key+')';

    return (
      <div id="StatusBar">
        <span>X: {this.props.editor.pixel.x}</span>
        <span>Y: {this.props.editor.pixel.y}</span>
        <div id="StatusBarColor" style={{background: this.props.editor.pixelColor.rgbaString()}}></div>
        <span id="StatusBarColorString">{this.props.editor.pixelColor.alpha() == 0 ? 'transparent': this.props.editor.pixelColor.hexString()}</span>
        <span>Frame {this.props.editor.frame}, {this.props.editor.pixels.length + this.props.editor.selection.pixels.length} pixels</span>
        &nbsp;
        <span>Zoom &times;{this.props.editor.zoom}</span>
        <div id="StatusBarButtons">
          <button id="toggleGrid" className={cssClasses} onClick={this.dispatchGridToggled} title={toggleGridTitle}>
            <i className="flaticon-3x3"></i>
          </button>
        </div>
      </div>
    );
  },
  dispatchGridToggled: function(event) {
    channel.publish('stage.grid.toggle', {grid: !this.props.editor.grid});
  }
});
var OffscreenFrameCanvas = React.createClass({
  propTypes: {
    frame: React.PropTypes.number.isRequired
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  render: function() {
    return (
      <canvas
        id={this.props.key}
        className="OffscreenFrameCanvas"
        width={this.props.file.size.width}
        height={this.props.file.size.height}
        style={{
          width: this.props.file.size.width,
          height: this.props.file.size.height
        }}
      ></canvas>
    );
  },
  componentDidMount: function() {
    this.subscriptions = [
      channel.subscribe('app.frame.select', this.prepareRefresh),
      channel.subscribe('file.layer.opacity.select', this.prepareRefresh),
      channel.subscribe('file.layer.visibility.toggle', this.prepareRefresh),
      channel.subscribe('stage.layer.update', this.prepareRefresh),
      channel.subscribe('stage.pixel.select', this.getPixelColor),
    ];
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh && (this.props.frame == this.props.editor.frame)) {
      this.getDOMNode().width = this.getDOMNode().width;
      var self = this;
      for(var i = this.props.file.layers.length -1; i >= 0; i--) {
        var layer = this.props.file.layers[i];
        if(layer.visible) {
          var sourceCanvas = document.getElementById('StageBoxLayer-'+layer.id);
          var ctx = self.getDOMNode().getContext('2d');
          ctx.globalAlpha = layer.opacity/100;
          ctx.drawImage(sourceCanvas, 0, 0, this.props.file.size.width, this.props.file.size.height);
        }
      }
      channel.publish('stage.frame.update', {frame: this.props.frame});
    }
  },
  prepareRefresh: function() {
    if(this.props.frame == this.props.editor.frame) {
      this.setState({needsRefresh: true});
    }
  },
  getPixelColor: function(data) {
    if(this.props.frame == this.props.editor.frame) {
      var ctx = this.getDOMNode().getContext('2d'),
          px = ctx.getImageData(data.point.x-1, data.point.y-1, 1, 1).data,
          color = Color({r:px[0], g:px[1], b:px[2], a:px[3]});

      editor.pixelColor = color;
    }
  }
});
var SelectionPattern = React.createClass({
  getInitialState: function() {
    return {
      frame: 1,
      frameCountUp: true,
    };
  },
  render: function() {
    var size = this.props.editor.zoom;

    return (
      <canvas id="SelectionPattern" width={size} height={size} style={{height: size, width: size}} />
    );
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 200);
    this.drawPattern();
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  componentDidUpdate: function() {
    this.drawPattern();
  },
  tick: function() {
    var frame = this.state.frame,
        countUp = this.state.frameCountUp;

    if(countUp) {
      frame++;
      if(frame == 4) countUp = false;
    }
    else {
      frame--;
      if(frame == 1) countUp = true;
    }
    this.setState({frame: frame, frameCountUp: countUp});
  },
  drawPattern: function() {

    var frame = this.state.frame,
        canvas = this.getDOMNode(),
        ctx = canvas.getContext('2d'),
        size = this.props.editor.zoom;

    ctx.webkitImageSmoothingEnabled = false;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000';
    ctx.fillRect(frame*(size/10), 0, size/2, size);
    ctx.fillRect(0, frame*(size/10), size, size/2);
  },
});
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
      stage.pixel.fill(pixel.layer, pixel.x, pixel.y, color);
    }
  });
};

// -----------------------------------------------------------------------

function NodeList2Array(NodeList) {
  //return [ ... NodeList ]; // ES6 version, doesn't work with JSX compiler
  return [].slice.call(NodeList);
};

function capitaliseFirstLetter(string) { // used in the brightness tool
  return string.charAt(0).toUpperCase() + string.slice(1);
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
        { topic: "stage.pixel.fill" }
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

  workspace.load();

  // load file
  file.fromJSONString(savedFile);

  // init auto palette
  editor.palettes.buildAuto();

  // render app
  React.renderComponent(
    <App editor={editor} file={file} pixel={stage.pixel} workspace={workspace} />
    , document.body);


  // draw all pixels to layers
  file.pixels.forEach(function(px) {
    stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
  });

  // select each frame once to initialize previews etc
  var totalFrames = file.frames.x * file.frames.y,
      frame = editor.frame;
  for(var i = 1; i <= totalFrames; i++) {
    channel.publish('app.frame.select', {frame: i});
  }

  channel.publish('app.frame.select', {frame: frame});

  // select top-most layer
  editor.layers.selectTop();

  // set inital zoom
  channel.publish('stage.zoom.select', {zoom: editor.zoom});

  // select brush tool
  channel.publish('app.tool.select', {tool: editor.tool});

  //setInterval(minutely, 60000);
};