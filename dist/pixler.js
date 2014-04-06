/** @jsx React.DOM */
'use strict';
var Signal = signals.Signal;
var signal = {

  file: {
    layerAdded: new Signal(),
    layerRemoved: new Signal(),
  },

  frameSelected: new Signal(),
  frameContentChanged: new Signal(),

  toolSelected: new Signal(),

  colorSelected: new Signal(),

  layerAdded: new Signal(),
  layerRemoved: new Signal(),
  layerSelected: new Signal(),
  layerContentChanged: new Signal(),
  layerOpacityChanged: new Signal(),
  layerVisibilityChanged: new Signal(),
  layerNameChanged: new Signal(),

  pixelSelected: new Signal(),
  pixelFilled: new Signal(),
  pixelCleared: new Signal(),

  zoomChanged: new Signal(),
  gridToggled: new Signal(),


  brightnessToolModeChanged: new Signal(),
  brightnessToolIntensityChanged: new Signal(),

  paletteSelected: new Signal(),
};
/*
var oldFn = signals.prototype.dispatch;
signals.prototype.dispatch = function() {
  console.log(arguments);
  oldFn.call(this);
}
*/
var File = function() {

  this.size = null;
  this.frames = null;
  this.layers = null;
  this.pixels = null;

  var self = this;

  this.deletePixelsOfLayer = function(layer) {
    this.pixels = this.pixels.filter(function(pixel) {
      return pixel.layer !== layer;
    });
  };

  this.deletePixel = function(layer, x, y) {
    this.pixels = this.pixels.filter(function(pixel) {
      return !(pixel.layer == layer && pixel.x == x && pixel.y == y);
    });
  }


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

  function pixelFromFile(pixel) {
    return {
      layer: pixel[0],
      x: pixel[1],
      y: pixel[2],
      r: pixel[3],
      g: pixel[4],
      b: pixel[5],
      a: pixel[6]
    };
  };

  function pixelToFile(pixel) {
    return [
      pixel.layer,
      pixel.x,
      pixel.y,
      pixel.r,
      pixel.g,
      pixel.b,
      pixel.a
    ];
  };

  this.getLayerById = function(id) {
    return _.findWhere(this.layers, {id: id}) || false;
  };

  this.toJSONString = function() {
    var strObj = {
      size: sizeToFile(this.size),
      frames: framesToFile(this.frames),
      layers: this.layers.map(layerToFile),
      pixels: this.pixels.map(pixelToFile)
    };
    return JSON.stringify(strObj);
  };

  this.fromJSONString = function(json) {
    json = JSON.parse(json);
    this.size = sizeFromFile(json.size);
    this.frames = framesFromFile(json.frames);
    this.layers = json.layers.map(layerFromFile);
    this.pixels = json.pixels.map(pixelFromFile);

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


  // signal handlers
  signal.layerOpacityChanged.add(function(id, opacity) {
    var layer = self.getLayerById(id);
    layer.opacity = opacity;
  });

  signal.layerVisibilityChanged.add(function(id, visible) {
    var layer = self.getLayerById(id);
    layer.visible = visible;
  });

  signal.layerNameChanged.add(function(id, name) {
    var layer = self.getLayerById(id);
    layer.name = name;
  });

  signal.file.layerAdded.add(function(layer) {

    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === layer) {
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
    signal.layerAdded.dispatch(newId);
  });

  signal.file.layerRemoved.add(function(layer) {

    // delete layer pixels
    self.deletePixelsOfLayer(layer);

    // get layer array index of all layers
    var index = 0;
    for(var i=0; i < self.layers.length; i++) {
      if(self.layers[i].id === layer) {
        index = i;
        break;
      }
    }

    // get layer array index of frame layers
    var frameLayers = _.where(self.layers, {frame: editor.frame});
    var fIndex = 0;
    for(var i=0; i < frameLayers.length; i++) {
      if(frameLayers[i].id === layer) {
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
    signal.layerRemoved.dispatch(shouldSelectLayer);
  });

  signal.pixelFilled.add(function(layer, x, y, color) {
    var c = color.rgb(),
        a = 1;

    var newPixel = pixelFromFile([layer, x, y, c.r, c.g, c.b, a]);
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
    self.deletePixel(layer, x, y);
    signal.layerContentChanged.dispatch(layer);
  });
};

var file = new File();
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
  this.palette = 'sprite';

  this.selection = false;

  this.buildAutoPalette = function() {
    var palette = [];
    file.pixels.forEach(function(pixel) {
      var color = Color().rgb(pixel.r, pixel.g, pixel.b).hexString();
      palette.push(color);
    });

    this.palettes.sprite.colors = _.uniq(palette, false);
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
    self.palettes.sprite.colors.push(color.hexString());
    self.palettes.sprite.colors = _.uniq(self.palettes.sprite.colors, false);
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
var Stage = function() {

  return {
    frame: {
      refresh: function(frame) {

        var frame = frame || editor.frame;

        this.clear();

        var frameLayers = _.where(file.layers, {frame: editor.frame});
        var pixels = [];

        frameLayers.forEach(function(frameLayer) {
          pixels.push(_.where(file.pixels, {layer: frameLayer.id}));
        });

        pixels = _.flatten(pixels, true);

        //console.log('refreshing frame '+editor.frame, pixels);

        pixels.forEach(function(px) {
          stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });

        //signal.pixelSelected.dispatch(0, 0);
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
        var pixels = _.where(file.pixels, {layer: editor.layer});

        //console.log('refreshing layer '+editor.layer);

        pixels.forEach(function(px) {
          stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
        });

        //signal.pixelSelected.dispatch(0, 0);
      }
    },
    pixel: {
      fill: function(layer, x, y, color, forceDispatch) {

        var dispatch = forceDispatch || arguments.length == 0 ? true : false,
            layer = layer || editor.layer,
            x = x || editor.pixel.x,
            y = y || editor.pixel.y,
            color = color || editor.color,
            ctx = document.getElementById('StageBoxLayer-'+layer).getContext('2d'),
            zoom = editor.zoom,
            cX = x -1,
            cY = y -1;

        ctx.fillStyle = color.hexString();
        ctx.fillRect(cX*zoom, cY*zoom, zoom, zoom);

        if(dispatch === true) signal.pixelFilled.dispatch(layer, x, y, color);
      },
      clear: function(layer, x, y) {

        var dispatch = arguments.length == 0 ? true : false,
            layer = layer || editor.layer,
            x = x || editor.pixel.x,
            y = y || editor.pixel.y,
            ctx = document.getElementById('StageBoxLayer-'+layer).getContext('2d'),
            zoom = editor.zoom,
            cX = x -1,
            cY = y -1;

        ctx.clearRect(cX*zoom, cY*zoom, zoom, zoom);

        if(dispatch === true) signal.pixelCleared.dispatch(layer, x, y);
      },
      lighten: function(layer, x, y) {
        if(editor.layerPixelColor.alpha() == 0) return; // skip transparent pixels

        var newColor = new Color(editor.layerPixelColor.rgb());
        var l = newColor.hsl().l;
        l+= editor.brightnessToolIntensity;

        newColor.values.hsl[2] = l;
        newColor.setValues("hsl", newColor.values.hsl);

        this.fill(layer, x, y, newColor, true);
        editor.layerPixelColor = newColor;
      },
      darken: function(layer, x, y) {
        if(editor.layerPixelColor.alpha() == 0) return; // skip transparent pixels

        var newColor = new Color(editor.layerPixelColor.rgb());
        var l = newColor.hsl().l;
        l-= editor.brightnessToolIntensity;

        newColor.values.hsl[2] = l;
        newColor.setValues("hsl", newColor.values.hsl);

        this.fill(layer, x, y, newColor, true);
        editor.layerPixelColor = newColor;
      },
    }
  }
};

var stage = new Stage();
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

    handle.onclick = function() {
      if(self.state.folded) {
        fold.style.display = 'block';
        handle.classList.remove('folded');
      }
      else {
        fold.style.display = 'none';
        handle.classList.add('folded');
      }
      self.setState({folded: !self.state.folded});
    }

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
    this.props.signal.frameContentChanged.add(this.prepareRefresh);
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
      var w = this.getDOMNode().clientWidth,
          h = this.getDOMNode().clientHeight,
          sourceCanvas = document.getElementById('OffscreenFrameCanvas-'+this.props.frame);

      this.getDOMNode().width = this.getDOMNode().width; // clear canvas
      this.getDOMNode().getContext('2d').webkitImageSmoothingEnabled = false;
      this.getDOMNode().getContext('2d').drawImage(sourceCanvas, 0, 0, w, h);
      this.setState({needsRefresh: false});
    }
  }
};
var App = React.createClass({
  render: function() {

    var totalFrames = this.props.file.frames.x * this.props.file.frames.y,
        frames = [];

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <div id="App">
        <div className="area top">
          <ToolContainer editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area left">
          <ToolBox editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area center">
          <StageBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} pixel={this.props.pixel}/>
        </div>
        <div className="area right">
          <PreviewBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
          <FrameBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
          <LayerBox file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area bottom">
          <StatusBar editor={this.props.editor} signal={this.props.signal} />
        </div>
        <div className="area offscreen">
          {frames.map(function(frame) {
            var id = 'OffscreenFrameCanvas-'+frame;
            return (
              <OffscreenFrameCanvas key={id} frame={frame} file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
            );
          }, this)}
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    var self = this,
        subscriptions = [
          'frameSelected',
          'toolSelected',
          'colorSelected',
          'gridToggled',
          'pixelSelected',
          'layerRemoved',
          'layerAdded',
          'layerSelected',
          'layerVisibilityChanged',
          'layerOpacityChanged',
          'layerNameChanged',
          'zoomChanged',

          'brightnessToolModeChanged',
          'brightnessToolIntensityChanged',
          'paletteSelected',
        ];

    subscriptions.forEach(function(item) {
      self.props.signal[item].add(self.updateProps);
    });

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

    var palettes = this.props.editor.palettes,
        palette = palettes[this.props.editor.palette];

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
                <PaletteSwatch key={color} color={color} signal={this.props.signal} />
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
    this.props.signal.paletteSelected.add(this.prepareResetScroll);
  },
  componentDidUpdate: function() {
    this.setInnerWidth();

    if(this.state.resetScroll) {
      this.resetScroll();
      this.setState({resetScroll:false});
    }
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
    this.setState({resetScroll: true});
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
    this.props.signal.paletteSelected.dispatch(palette);
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
    this.props.signal.colorSelected.dispatch(this.props.color);
  }
});
var BrushTool = React.createClass({
  render: function() {
    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon flaticon-small23"/>
        <input type="color" id="Brush-Colorpicker" className="ColorSwatch" value={editor.color.hexString()} onChange={this.dispatchColorSelected} title={editor.color.hexString()} />
        <span className="spacer"/>
        <Palette editor={this.props.editor} signal={this.props.signal} />
      </div>
    );
  },
  dispatchColorSelected: function(event) {
    var color = event.target.value;
    signal.colorSelected.dispatch(color);
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

        <span className="hint"></span>
      </div>
    );
  }
});
var BrightnessTool = React.createClass({
  render: function() {

    var lClass = 'small transparent active',
        lDisabled = true,
        dClass = 'small',
        dDisabled = false;

    if(this.props.editor.brightnessToolMode == 'darken') {
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


        <input type="range" min="1" max="100" className="brightness-slider" value={this.props.editor.brightnessToolIntensity} onChange={this.setIntensity} />
        <span>{capitaliseFirstLetter(this.props.editor.brightnessToolMode)} by</span>
        <input type="number" min="1" max="100" className="brightness-number" value={this.props.editor.brightnessToolIntensity} onChange={this.setIntensity} />
        <span>%</span>


        <span className="spacer"></span>
        <span className="hint">Make existing pixels brighter or darker with this brush.</span>
      </div>
    );
  },
  selectLightenTool: function() {
    this.props.signal.brightnessToolModeChanged.dispatch('lighten');
  },
  selectDarkenTool: function() {
    this.props.signal.brightnessToolModeChanged.dispatch('darken');
  },
  setIntensity: function(event) {
    var newIntensity = parseInt(event.target.value);
    this.props.signal.brightnessToolIntensityChanged.dispatch(newIntensity);
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
    signal.zoomChanged.dispatch(zoom);
  },
  zoomIn: function() {
    if(editor.zoom+1 <= 50) this.dispatchZoomChanged(null, editor.zoom+1);
  },
  zoomOut: function() {
    if(editor.zoom-1 >= 1 ) this.dispatchZoomChanged(null, editor.zoom-1);
  },
  fitToScreen: function() {
    var top = 40,
        bottom = 20,
        left = 40,
        right = 200;

    var zoom = Math.floor((window.innerHeight - top - bottom)/file.size.height);
    if((file.size.width*zoom) > (window.innerWidth - left - right)) {
      zoom = Math.floor((window.innerWidth - left - right)/file.size.width);
    }

    this.dispatchZoomChanged(null, zoom);
  }
});
var StageBox = React.createClass({
  render: function() {

    var w = this.props.file.size.width*this.props.editor.zoom,
        h = this.props.file.size.height*this.props.editor.zoom;

    var top = 40,
        left = 40,
        right = 200,
        bottom = 20,
        x = window.innerWidth/2,
        y = window.innerHeight/2;

    var cssleft = x-(w/2)-((right-left)/2),
        csstop = y-(h/2)+((top-bottom)/2);

    cssleft = (cssleft < left) ? left : cssleft;
    csstop = (csstop < top) ? top : csstop;

    return (
      <div id="StageBox" draggable="false" onDragStart={this.dragStart} onDragEnd={this.dragEnd} style={{width: w, height: h, left: cssleft, top: csstop}}>
        <StageBoxToolsLayer
          ref="ToolsLayer"
          width={w}
          height={h}
          editor={this.props.editor}
          signal={this.props.signal} />

        {this.props.file.layers.map(function(layer) {
          var id = 'StageBoxLayer-'+layer.id;
          var visible = (layer.frame == this.props.editor.frame) ? true : false;
          return (
            <StageBoxLayer key={id} width={w} height={h} layer={layer} visible={visible} />
          );
        }, this)}
      </div>
    );
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    }
  },
  componentDidMount: function() {
    this.props.signal.zoomChanged.add(this.prepareRefresh);
    this.props.signal.frameSelected.add(this.prepareRefresh);
  },
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      stage.frame.refresh();
      this.setState({needsRefresh: false});
    }
  }
/*,
  dragStart: function(event) {
    console.log('dragStart', event);

    event.target.style.opacity = 0.4;
  },
  dragEnd: function(event) {

    var x = event.nativeEvent.pageX < 0 ? 0 : event.nativeEvent.pageX,
        y = (event.nativeEvent.pageY < 0 ? 0 : event.nativeEvent.pageY)/editor.zoom;

    console.log('dragEnd', x, y, event.nativeEvent);
    this.getDOMNode().style.left = x+'px';
    this.getDOMNode().style.top = y+'px';
    this.getDOMNode().style.opacity = 1;
  }*/
});
var StageBoxLayer = React.createClass({
  render: function() {

    var cssClass = 'Layer';
    if(this.props.visible === false) cssClass+= ' hidden';

    var display = (this.props.layer.visible===true) ? 'block' : 'none';

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
var StageBoxToolsLayer = React.createClass({
  getInitialState: function() {
    return {
      mousedown: false,
      last: null, // we need to record the mousedown timestamp because of a chrome bug,
                  // see https://code.google.com/p/chromium/issues/detail?id=161464
                  // and http://stackoverflow.com/questions/14538743/what-to-do-if-mousemove-and-click-events-fire-simultaneously
    };
  },
  render: function() {
    return (
      <canvas
        id="Layer-Tools"
        className="Layer"
        width={this.props.width}
        height={this.props.height}>
      </canvas>
    );
  },
  componentDidMount: function() {
    this.getDOMNode().addEventListener('mousedown', this.mousedown);
    this.getDOMNode().addEventListener('mouseup', this.mouseup);
    this.getDOMNode().addEventListener('mouseleave', this.mouseleave);
    this.getDOMNode().addEventListener('mousemove', this.dispatchPixelSelected);

    this.props.signal.toolSelected.add(this.mouseup);
    this.props.signal.pixelSelected.add(this.getLayerPixelColor);
  },
  componentDidUpdate: function() {

    this.getDOMNode().width = this.getDOMNode().width;

    if(this.props.editor.grid === true) {
      this.drawGrid();
    }

    this.drawPixelCursor();

    var self = this;

    function layerVisible() {
      var layer = file.getLayerById(self.props.editor.layer);
      return layer.visible && layer.opacity > 0;
    }

    if(this.state.mousedown) {
      switch(this.props.editor.tool) {
        case 'BrushTool':
          if(layerVisible()) stage.pixel.fill();
          else {
            this.mouseup(); // prevent additional alerts
            alert('You are trying to paint on an invisible layer. Please make the layer visible and try again.');
          }
          break;
        case 'EraserTool':
          if(layerVisible()) stage.pixel.clear();
          else {
            this.mouseup();  // prevent additional alerts
            alert('You are trying to erase on an invisible layer. Please make the layer visible and try again.');
          }
          break;
        case 'EyedropperTool':
          this.props.signal.toolSelected.dispatch('BrushTool');
          this.props.signal.colorSelected.dispatch(editor.pixelColor.hexString());
          break;
        case 'BrightnessTool':
          if(layerVisible()) {
            var px = _.findWhere(file.pixels, {layer: editor.layer, x: editor.pixel.x, y: editor.pixel.y });
            //console.log(px);
            if(!_.isUndefined(px)) {
              if(editor.brightnessToolMode == 'lighten') stage.pixel.lighten();
              else if(editor.brightnessToolMode == 'darken') stage.pixel.darken();
            }
          }
          else {
            this.mouseup(); // prevent additional alerts
            alert('You are trying to paint on an invisible layer. Please make the layer visible and try again.');
          }
          break;
      }
    }
  },
  dispatchPixelSelected: function(event) {
    if(event.timeStamp > this.state.last + 10) {
      var world_x = Math.ceil(event.layerX/this.props.editor.zoom),
          world_y = Math.ceil(event.layerY/this.props.editor.zoom);

      this.props.signal.pixelSelected.dispatch(world_x, world_y);
    }
  },
  mousedown: function(event) {
    this.setState({mousedown:true, last: event.timeStamp});
  },
  mouseup: function() {
    this.setState({mousedown:false});
  },
  mouseleave: function() {
    this.props.signal.pixelSelected.dispatch(0, 0);
  },
  getLayerPixelColor: function(x, y) {
    var layer = file.getLayerById(this.props.editor.layer),
        ctx = document.getElementById('StageBoxLayer-'+layer.id).getContext('2d'),
        px = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data,
        color = Color({r:px[0], g:px[1], b:px[2], a:px[3]});

    editor.layerPixelColor = color;
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
  drawGrid: function() {

    var canvas = this.getDOMNode(),
        zoom = this.props.editor.zoom;

    //console.log('drawing grid', zoom);

    if(zoom < 3) return;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle="#cccccc";

    // vertical lines
    for( var x = zoom+0.5; x < canvas.width; x+= zoom) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // horizontal lines
    for( var y = zoom+0.5; y < canvas.height; y+= zoom) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }
});
// clean
var ToolBox = React.createClass({
  render: function() {
    return (
      <div id="ToolBox">
        <h4>Tools</h4>
        <div>
          <ToolBoxTool id="BrushTool" title="Brush" icon="flaticon-small23" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="EraserTool" title="Eraser" icon="flaticon-double31" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="EyedropperTool" title="Eyedropper" icon="flaticon-eyedropper2" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="RectangularSelectionTool" title="Selection" icon="flaticon-selection7" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="BrightnessTool" title="Brightness" icon="flaticon-sun4" editor={this.props.editor} signal={this.props.signal} />
          {/*
          <ToolBoxTool id="FillTool" title="Fill tool" icon="icon-bucket" signal={this.props.signal} />
          <ToolBoxTool id="RectangularSelectionTool" title="Selection tool" icon="" signal={this.props.signal} />
          <ToolBoxTool id="MoveTool" title="Move tool" icon="" signal={this.props.signal} />
          <ToolBoxTool id="HandTool" title="Hand tool" icon="icon-magnet" signal={this.props.signal} />
          */}
          <ToolBoxTool id="ZoomTool" title="Zoom" icon="flaticon-magnifier5" editor={this.props.editor} signal={this.props.signal} />
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
  dispatchToolSelected: function(tool, event) {
    this.props.signal.toolSelected.dispatch(tool);
  }
});
var PreviewBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    return (
      <div id="PreviewBox" className="box">
        <h4 className="foldable-handle">Preview</h4>
        <div className="foldable-fold">
          <PreviewBoxPreview frame={this.props.editor.frame} file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
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
              self.props.signal.frameSelected.dispatch(frame);
            }

            return (
              <div key={id} className={cssClass} style={{width:frameSize, height:frameSize}} onClick={clickHandler}>
                <FrameBoxFrame frame={frame} size={frameSize} file={this.props.file} editor={this.props.editor} signal={this.props.signal} />
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
    this.props.signal.frameSelected.dispatch(event.target.value);
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
          {this.props.file.layers.map(function(layer) {
            var visible = (layer.frame == this.props.editor.frame) ? true : false;
            var id = 'LayerBoxLayer-'+layer.id;
            return (
              <LayerBoxLayer key={id} layer={layer} size={this.props.file.size} editor={this.props.editor} signal={this.props.signal} visible={visible} />
            );
          }, this)}
          <div className="actions">
            <button title="New layer above selected layer" onClick={this.dispatchLayerAdded} className="tiny transparent"><i className="flaticon-plus25"></i></button>
            <button title="Delete selected layer" onClick={this.dispatchLayerRemoved} className="tiny transparent" disabled={disabled}><i className="flaticon-minus18"></i></button>
          </div>
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    this.props.signal.layerAdded.add(this.shouldSelectLayer);
    this.props.signal.layerRemoved.add(this.shouldSelectLayer);
  },
  componentDidUpdate: function() {
    if(this.state.shouldSelectLayer !== false) {
      this.props.signal.layerSelected.dispatch(this.state.shouldSelectLayer);
      this.setState({ shouldSelectLayer: false });
    }
  },
  dispatchLayerAdded: function(event) {
    this.props.signal.file.layerAdded.dispatch(this.props.editor.layer);
  },
  dispatchLayerRemoved: function(event) {
    this.props.signal.file.layerRemoved.dispatch(this.props.editor.layer);
  },
  shouldSelectLayer: function(layer) {
    this.setState({ shouldSelectLayer: layer });
  }
});
var LayerBoxLayer = React.createClass({
  render: function() {
    var cssClass = 'LayerBoxLayer';
    if(this.props.layer.id == this.props.editor.layer) cssClass+= ' selected';
    if(this.props.visible === false) cssClass+= ' hidden';

    return (
      <div id={this.props.key} className={cssClass}>
        <div className="visibility">
          <input type="checkbox" checked={this.props.layer.visible} onChange={this.dispatchLayerVisibilityChanged}/>
        </div>
        <div className="preview">
          <LayerBoxLayerPreview ref="preview" layer={this.props.layer.id} size={this.props.size} zoom={this.props.editor.zoom} signal={this.props.signal}/>
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
    this.props.signal.layerVisibilityChanged.dispatch(this.props.layer.id, event.target.checked);
  },
  dispatchLayerOpacityChanged: function(event) {
    this.props.signal.layerOpacityChanged.dispatch(this.props.layer.id, parseInt(event.target.value, 10));
  },
  dispatchLayerNameChanged: function(event) {
    if(event.type == 'blur' || (event.nativeEvent.type == 'keydown' && event.nativeEvent.which == 13)) {

      this.refs.nameText.getDOMNode().style.display = 'none';
      this.refs.nameLabel.getDOMNode().style.display = 'block';

      if(!_.isEmpty(event.target.value.trim())) {
        this.refs.nameLabel.getDOMNode().innerHTML = event.target.value;
        this.props.signal.layerNameChanged.dispatch(this.props.layer.id, event.target.value);
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
    this.props.signal.frameSelected.add(this.prepareRefresh);
    this.props.signal.layerContentChanged.add(this.prepareRefresh);
  },
  componentWillUnmount: function() {
    this.props.signal.frameSelected.remove(this.prepareRefresh);
    this.props.signal.layerContentChanged.remove(this.prepareRefresh);
  },
  getInitialState: function() {
    return {
      needsRefresh: false
    };
  },
  dispatchLayerSelected: function(event) {
    this.props.signal.layerSelected.dispatch(this.props.layer);
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
    var cssClasses = (this.props.editor.grid === true ? 'active' : '') + ' tiny transparent';
    return (
      <div id="StatusBar">
        <span>X: {this.props.editor.pixel.x}</span>
        <span>Y: {this.props.editor.pixel.y}</span>
        <div id="StatusBarColor" style={{background: this.props.editor.pixelColor.rgbaString()}}></div>
        <span id="StatusBarColorString">{this.props.editor.pixelColor.alpha() == 0 ? 'transparent': this.props.editor.pixelColor.hexString()}</span>
        <span>Frame {this.props.editor.frame}</span>
        &nbsp;
        <span>Zoom &times;{this.props.editor.zoom}</span>
        <div id="StatusBarButtons">
          <button id="toggleGrid" className={cssClasses} onClick={this.dispatchGridToggled} title="Toggle grid">
            <i className="flaticon-3x3"></i>
          </button>
        </div>
      </div>
    );
  },
  dispatchGridToggled: function(event) {
    this.props.signal.gridToggled.dispatch(!this.props.editor.grid);
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

    this.props.signal.frameSelected.add(this.prepareRefresh);

    this.props.signal.layerContentChanged.add(this.prepareRefresh);
    this.props.signal.layerVisibilityChanged.add(this.prepareRefresh);
    this.props.signal.layerOpacityChanged.add(this.prepareRefresh);

    this.props.signal.pixelSelected.add(this.getPixelColor);
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
      this.props.signal.frameContentChanged.dispatch(this.props.frame);
    }
  },
  prepareRefresh: function() {
    if(this.props.frame == this.props.editor.frame) {
      this.setState({needsRefresh: true});
    }
  },
  getPixelColor: function(x, y) {
    if(this.props.frame == this.props.editor.frame) {
      var ctx = this.getDOMNode().getContext('2d'),
          px = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data,
          color = Color({r:px[0], g:px[1], b:px[2], a:px[3]});

      editor.pixelColor = color;
    }
  }
});
function NodeList2Array(NodeList) {
  return [].slice.call(NodeList);
};

function capitaliseFirstLetter(string) { // used in the brightness tool
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
}

window.onload = function() {

  // load file
  file.fromJSONString(savedFile);

  // init auto palette
  editor.buildAutoPalette();

  // render app
  React.renderComponent(<App editor={editor} file={file} pixel={stage.pixel} signal={signal}/>, document.body);


  // draw all pixels to layers
  file.pixels.forEach(function(px) {
    stage.pixel.fill(px.layer, px.x, px.y, Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')'));
  });

  // select each frame once to initialize previews etc
  var totalFrames = file.frames.x * file.frames.y;
  for(var i = 1; i <= totalFrames; i++) {
    signal.frameSelected.dispatch(i);
  }

  // select the first frame again
  signal.frameSelected.dispatch(1);

  // select top-most layer
  editor.selectTopLayer();

  // setup zoom
  signal.zoomChanged.dispatch(editor.zoom);


  // select brush tool
  signal.toolSelected.dispatch('BrushTool');
};