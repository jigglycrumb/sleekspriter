/** @jsx React.DOM */
var App = React.createClass({displayName: 'App',
  render: function() {

    var totalFrames = this.props.editor.frames.x * this.props.editor.frames.y,
        frames = [];

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      React.DOM.div( {id:"App"}, 
        React.DOM.div( {className:"area top"}, 
          ToolContainer( {editor:this.props.editor} )
        ),
        React.DOM.div( {className:"area left"}, 
          ToolBox( {editor:this.props.editor} )
        ),
        React.DOM.div( {className:"area center"}, 
          StageBox( {editor:this.props.editor} )
        ),
        React.DOM.div( {className:"area right"}, 
          React.DOM.div( {id:"layerboxhelper"}, 
            PreviewBox( {editor:this.props.editor, workspace:this.props.workspace, fold:"preview"} ),
            FrameBox( {editor:this.props.editor, workspace:this.props.workspace, fold:"frames"} )
          ),
          LayerBox( {editor:this.props.editor, workspace:this.props.workspace, fold:"layers"} )
        ),
        React.DOM.div( {className:"area bottom"}, 
          StatusBar( {editor:this.props.editor} )
        ),
        React.DOM.div( {className:"area offscreen"}, 
          frames.map(function(frame) {
            var id = 'OffscreenFrameCanvas-'+frame;
            return (
              OffscreenFrameCanvas(
                {key:id,
                id:frame,
                width:this.props.editor.size.width,
                height:this.props.editor.size.height,
                selectedframe:this.props.editor.frame} )
            );
          }, this),

          SelectionPattern( {editor:this.props.editor} )
        )
      )
    );
  },
  componentDidMount: function() {

    channel.subscribe('app.frame.select', this.updateProps);
    channel.subscribe('app.layer.select', this.updateProps);
    channel.subscribe('app.tool.select', this.updateProps);
    channel.subscribe('app.color.select', this.updateProps);
    channel.subscribe('app.pixel.select', this.updateProps);
    channel.subscribe('stage.grid.toggle', this.updateProps);
    channel.subscribe('stage.zoom.select', this.updateProps);

    channel.subscribe('file.layer.opacity.select', this.updateProps);
    channel.subscribe('file.layer.visibility.toggle', this.updateProps);
    return;

    channel.subscribe('app.palette.select', this.updateProps);
    channel.subscribe('app.box.toggle', this.updateProps);
    channel.subscribe('app.brightnesstool.mode.select', this.updateProps);
    channel.subscribe('app.brightnesstool.intensity.select', this.updateProps);
    channel.subscribe('file.layer.name.select', this.updateProps);
    channel.subscribe('stage.tool.move', this.updateProps);
    //channel.subscribe('app.layer.add', this.updateProps);
  },
  updateProps: function() {
    //console.log('updating App props');
    this.setProps({editor: editor, workspace: workspace});
  },
  /*
  componentWillReceiveProps: function(props) {
    console.log(props);
  },
  */
});
/** @jsx React.DOM */
var BrightnessTool = React.createClass({displayName: 'BrightnessTool',
  render: function() {

    function capitaliseFirstLetter(string) { // used in the brightness tool
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

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
      React.DOM.div( {id:"Brightness-Tool", className:"ToolComponent"}, 
        React.DOM.i( {className:"icon flaticon-sun4"}),
        React.DOM.button( {onClick:this.selectLightenTool, className:lClass, disabled:lDisabled, title:"Lighten pixels"}, React.DOM.i( {className:"flaticon-dark26"})),
        React.DOM.button( {onClick:this.selectDarkenTool, className:dClass, disabled:dDisabled, title:"Darken pixels"}, React.DOM.i( {className:"flaticon-clear3"})),


        React.DOM.input( {type:"range", min:"1", max:"100", className:"brightness-slider", value:this.props.editor.brightnessTool.intensity, onChange:this.setIntensity} ),
        React.DOM.span(null, capitaliseFirstLetter(this.props.editor.brightnessTool.mode), " by"),
        React.DOM.input( {type:"number", min:"1", max:"100", className:"brightness-number", value:this.props.editor.brightnessTool.intensity, onChange:this.setIntensity} ),
        React.DOM.span(null, "%"),


        React.DOM.span( {className:"spacer"}),
        React.DOM.span( {className:"hint"}, "Make existing pixels brighter or darker with this brush.")
      )
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
/** @jsx React.DOM */
var BrushTool = React.createClass({displayName: 'BrushTool',
  render: function() {
    return (
      React.DOM.div( {id:"Brush-Tool", className:"ToolComponent"}, 
        React.DOM.i( {className:"icon flaticon-small23"}),
        React.DOM.input( {type:"color", id:"Brush-Colorpicker", className:"ColorSwatch", value:editor.color.hexString(), onChange:this.dispatchColorSelected, title:editor.color.hexString()} ),
        React.DOM.span( {className:"spacer"}),
        Palette( {editor:this.props.editor} )
      )
    );
  },
  dispatchColorSelected: function(event) {
    var color = event.target.value;
    channel.publish('app.color.select', {color: color});
  }
});
  /*
  drawPattern: function() {

    var frame = this.state.frame,
        canvas = this.getDOMNode(),
        ctx = canvas.getContext('2d'),
        colors = [
          ['#000', '#fff', '#000'],
          ['#fff', '#000', '#fff'],
          ['#000', '#fff', '#000'],
        ];

    canvas.width = canvas.width;

    for(var x = 2; x >= 0; x--) {
      for(var y = 2; y >= 0; y--) {
        ctx.fillStyle = colors[x][y];
        ctx.fillRect(x*5+frame, y*5+frame, -5, -5);
      }
    }
  },
  */
/** @jsx React.DOM */
var EraserTool = React.createClass({displayName: 'EraserTool',
  render: function() {
    return (
      React.DOM.div( {id:"Eraser-Tool", className:"ToolComponent"}, 
        React.DOM.i( {className:"icon flaticon-double31", style:{position:'relative', left: '0.25em'}}),

        React.DOM.span( {className:"hint"}, "Click a pixel to erase it.")
      )
    );
  }
});
/** @jsx React.DOM */
var EyedropperTool = React.createClass({displayName: 'EyedropperTool',
  render: function() {
    return (
      React.DOM.div( {id:"Eyedropper-Tool", className:"ToolComponent"}, 
        React.DOM.i( {className:"icon flaticon-eyedropper2"}),
        React.DOM.div( {id:"EyedropperSwatch", className:"colorswatch", style:{background: this.props.editor.pixelColor.rgbaString()}}),
        React.DOM.ul(null, 
          React.DOM.li(null, "Hex: ", this.props.editor.pixelColor.alpha() == 0 ? '': this.props.editor.pixelColor.hexString()),
          React.DOM.li(null, "RGB: ", this.props.editor.pixelColor.alpha() == 0 ? '': this.props.editor.pixelColor.red()+', '+this.props.editor.pixelColor.green()+', '+this.props.editor.pixelColor.blue())
        ),
        React.DOM.span( {className:"spacer"}),
        React.DOM.span( {className:"hint"}, "Click any non-transparent pixel to pick its color.")

      )
    );
  }
});
/** @jsx React.DOM */
var FrameBox = React.createClass({displayName: 'FrameBox',
  mixins: [FoldableMixin],
  render: function() {
    var totalFrames = this.props.editor.frames.x * this.props.editor.frames.y,
        frames = [],
        frameSize = Math.floor(180/this.props.editor.frames.x),
        w = frameSize*this.props.editor.frames.x,
        l = (200-w)/2,
        self = this;

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      React.DOM.div( {id:"FrameBox", className:"box"}, 
        React.DOM.h4( {className:"foldable-handle"}, "Frames"),
        React.DOM.div( {className:"foldable-fold"}, 
          React.DOM.div( {id:"FrameBoxFrames", style:{width:w, marginLeft:l}}, 
          frames.map(function(frame) {
            var id = 'FrameBoxFrame-'+frame;

            var cssClass = 'frame';
            if(frame == this.props.editor.frame) cssClass+= ' selected';
            if(frame % this.props.editor.frames.x == 0) cssClass+= ' right';
            if(frame <= this.props.editor.frames.x) cssClass+= ' top';

            var clickHandler = function() {
              channel.publish('app.frame.select', {frame: frame});
            };

            return (
              React.DOM.div( {key:id, className:cssClass, style:{width:frameSize, height:frameSize}, onClick:clickHandler}, 
                FrameBoxFrame(
                  {id:frame,
                  width:this.props.editor.size.width,
                  height:this.props.editor.size.height,
                  size:frameSize} )
              )
            );
          }, this)
          ),
          React.DOM.div( {className:"actions"}, 
            "Frame ",
            React.DOM.input( {type:"number", className:"frame-number", min:"1", max:totalFrames, value:this.props.editor.frame, onChange:this.dispatchFrameSelected} ),
            " of ",
            totalFrames
          )
        )
      )
    );
  },
  dispatchFrameSelected: function(event) {
    channel.publish('app.frame.select', {frame: parseInt(event.target.value)});
  }
});
/** @jsx React.DOM */
var FrameBoxFrame = React.createClass({displayName: 'FrameBoxFrame',
  mixins: [ResetStateMixin, PostalSubscriptionMixin, FrameCanvasMixin],
  render: function() {
    var style = fitCanvasIntoSquareContainer(this.props.width, this.props.height, this.props.size);
    return (
      React.DOM.canvas(
        {width:style.width,
        height:style.height,
        style:style} )
    );
  }
});
/** @jsx React.DOM */
var LayerBox = React.createClass({displayName: 'LayerBox',
  mixins: [FoldableMixin],
  getInitialState: function() {
    return {
      shouldSelectLayer: false
    }
  },
  render: function() {
    var disabled = this.props.editor.layers.frame.length <= 1 ? true : false;
    return (
      React.DOM.div( {id:"LayerBox", className:"box"}, 
        React.DOM.h4( {className:"foldable-handle"}, "Layers"),
        React.DOM.div( {className:"foldable-fold"}, 
          React.DOM.div( {className:"layers"}, 
            this.props.editor.layers.frame.map(function(layer) {
              var id = 'LayerBoxLayer-'+layer.id;
              return (
                LayerBoxLayer( {key:id, layer:layer, editor:this.props.editor} )
              );
            }, this)
          ),
          React.DOM.div( {className:"actions"}, 
            React.DOM.button( {title:"New layer above selected layer", onClick:this.dispatchLayerAdded, className:"tiny transparent"}, React.DOM.i( {className:"flaticon-plus25"})),
            React.DOM.button( {title:"Delete selected layer", onClick:this.dispatchLayerRemoved, className:"tiny transparent", disabled:disabled}, React.DOM.i( {className:"flaticon-minus18"}))
          )
        )
      )
    );
  },
  componentDidMount: function() {
    //channel.subscribe('app.layer.add', this.shouldSelectLayer);
    //channel.subscribe('app.layer.delete', this.shouldSelectLayer);
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
/** @jsx React.DOM */
var LayerBoxLayer = React.createClass({displayName: 'LayerBoxLayer',
  propTypes: {
     layer: React.PropTypes.object.isRequired // layer object
  },
  render: function() {
    var cssClass = 'LayerBoxLayer';
    if(this.props.layer.id == this.props.editor.layers.selected) cssClass+= ' selected';
    return (
      React.DOM.div( {id:this.props.key, className:cssClass}, 
        React.DOM.div( {className:"visibility"}, 
          React.DOM.input( {type:"checkbox", checked:this.props.layer.visible, onChange:this.dispatchLayerVisibilityChanged})
        ),
        React.DOM.div( {className:"preview", onClick:this.dispatchLayerSelected}, 
          LayerBoxLayerPreview( {ref:"preview", id:this.props.layer.id, width:this.props.editor.size.width, height:this.props.editor.size.height} )
        ),
        React.DOM.div( {className:"name"}, 
          React.DOM.label( {ref:"nameLabel", className:"name-label", onClick:this.showNameInput}, this.props.layer.name),
          React.DOM.input( {ref:"nameText", className:"name-text", type:"text", defaultValue:this.props.layer.name, onKeyDown:this.dispatchLayerNameChanged})
        ),
        React.DOM.input( {ref:"opacitySlider", type:"range", className:"opacity-slider", min:"0", max:"100", value:this.props.layer.opacity, onChange:this.dispatchLayerOpacityChanged} ),
        React.DOM.input( {ref:"opacityNumber", type:"number", className:"opacity-number", min:"0", max:"100", value:this.props.layer.opacity, onChange:this.dispatchLayerOpacityChanged} )
      )
    );
  },
  componentDidMount: function() {
    this.refs.nameText.getDOMNode().addEventListener('blur', this.dispatchLayerNameChanged);
  },
  componentWillUnmount: function() {
    this.refs.nameText.getDOMNode().removeEventListener('blur', this.dispatchLayerNameChanged);
  },
  dispatchLayerSelected: function() {
    channel.publish('app.layer.select', {layer: this.props.layer.id});
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
/** @jsx React.DOM */
var LayerBoxLayerPreview = React.createClass({displayName: 'LayerBoxLayerPreview',
  mixins:[ResetStateMixin, PostalSubscriptionMixin, LayerCanvasMixin],
  render: function() {
    var style = fitCanvasIntoSquareContainer(this.props.width, this.props.height, 30);
    return (
      React.DOM.canvas( {width:style.width, height:style.height, style:style})
    );
  }
});
/** @jsx React.DOM */
var MoveTool = React.createClass({displayName: 'MoveTool',
  render: function() {
    return (
      React.DOM.div( {id:"Move-Tool", className:"ToolComponent"}, 
        React.DOM.i( {className:"icon flaticon-move11"}),

        React.DOM.span( {className:"hint"}, "Move pixels of a layer by dragging.")
      )
    );
  }
});
/** @jsx React.DOM */
var OffscreenFrameCanvas = React.createClass({displayName: 'OffscreenFrameCanvas',
  mixins: [ResetStateMixin, PostalSubscriptionMixin, FrameCanvasMixin],
  render: function() {
    return (
      React.DOM.canvas(
        {id:this.props.key,
        className:"OffscreenFrameCanvas",
        width:this.props.width,
        height:this.props.height,
        style:{
          width: this.props.width,
          height: this.props.height
        }}
      )
    );
  },
  componentDidMount: function() {
    this.subscriptions.push(channel.subscribe('app.pixel.select', this.getPixelColor));
  },
  getPixelColor: function(data) {
    if(this.props.id == this.props.selectedframe) {
      var ctx = this.getDOMNode().getContext('2d'),
          px = ctx.getImageData(data.point.x-1, data.point.y-1, 1, 1).data,
          color = Color({r:px[0], g:px[1], b:px[2], a:px[3]});

      editor.pixelColor = color;
    }
  }
});
/** @jsx React.DOM */
var PaintBucketTool = React.createClass({displayName: 'PaintBucketTool',
  render: function() {
    return (
      React.DOM.div( {id:"PaintBucket-Tool", className:"ToolComponent"}, 
        React.DOM.i( {className:"icon flaticon-paint2"}),
        React.DOM.input( {type:"color", id:"PaintBucket-Colorpicker", className:"ColorSwatch", value:editor.color.hexString(), onChange:this.dispatchColorSelected, title:editor.color.hexString()} ),
        React.DOM.span( {className:"spacer"}),
        Palette( {editor:this.props.editor} )
      )
    );
  },
  dispatchColorSelected: function(event) {
    var color = event.target.value;
    channel.publish('app.color.select', {color: color});
  }
});
/** @jsx React.DOM */
var Palette = React.createClass({displayName: 'Palette',
  getInitialState: function() {
    return {
      resetScroll: false,
    };
  },
  render: function() {

    var palettes = this.props.editor.palettes.available,
        palette = palettes[this.props.editor.palettes.selected];

    return (
      React.DOM.div( {className:"palette"}, 
        React.DOM.div( {className:"switch", onClick:this.showPalettes}, 
          React.DOM.i( {className:"icon flaticon-color1"}),
          React.DOM.i( {className:"switch-arrow flaticon-little9"}),
          React.DOM.div( {className:"name"}, palette.short),
          React.DOM.ul( {ref:"paletteList", className:"list"}, 
            Object.keys(palettes).map(function(paletteKey) {
              var p = palettes[paletteKey];
              return (
                React.DOM.li( {key:paletteKey, 'data-palette':paletteKey, onClick:this.selectPalette}, p.title, " (",p.colors.length, " colours)")
              );
            }, this)
          )
        ),
        React.DOM.button( {ref:"buttonScrollLeft", className:"scroll left", onClick:this.scrollLeft}, 
          React.DOM.i( {className:"flaticon-arrow85"})
        ),
        React.DOM.div( {className:"outer"}, 
          React.DOM.div( {className:"inner"}, 
            palette.colors.map(function(color) {
              return (
                PaletteSwatch( {key:color, color:color} )
              );
            }, this)
          )
        ),
        React.DOM.button( {ref:"buttonScrollRight", className:"scroll right", onClick:this.scrollRight}, 
          React.DOM.i( {className:"flaticon-mini7"})
        )
      )
    );
  },
  componentDidMount: function() {
    this.setInnerWidth();
    this.resetScroll();

    this.subscriptions = [
      //channel.subscribe('app.palette.select', this.prepareResetScroll)
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
/** @jsx React.DOM */
var PaletteSwatch = React.createClass({displayName: 'PaletteSwatch',
  propTypes: {
    color: React.PropTypes.string.isRequired,
  },
  render: function() {
    return (
      React.DOM.div(
        {className:"colorswatch",
        style:{background: this.props.color},
        title:this.props.color,
        onClick:this.select} )
    );
  },
  select: function() {
    channel.publish('app.color.select', {color: this.props.color});
  }
});
/** @jsx React.DOM */
var PreviewBox = React.createClass({displayName: 'PreviewBox',
  mixins: [FoldableMixin],
  render: function() {
    return (
      React.DOM.div( {id:"PreviewBox", className:"box"}, 
        React.DOM.h4( {className:"foldable-handle"}, "Preview"),
        React.DOM.div( {className:"foldable-fold"}, 
          PreviewBoxPreview( {id:this.props.editor.frame, width:this.props.editor.size.width, height:this.props.editor.size.height} )
        )
      )
    );
  }
});
/** @jsx React.DOM */
var PreviewBoxPreview = React.createClass({displayName: 'PreviewBoxPreview',
  mixins: [ResetStateMixin, PostalSubscriptionMixin, FrameCanvasMixin],
  render: function() {

    var scale = 1,
        maxWidth = 160,
        maxHeight = 90;

    if(this.props.width > this.props.height) {
      // scale to width
      scale = maxWidth/this.props.width;
    }
    else {
      // scale to height
      scale = maxHeight/this.props.height;
    }

    var width = this.props.width*scale,
        height = this.props.height*scale;

    return (
      React.DOM.canvas(
        {id:"PreviewBoxPreview",
        width:width,
        height:height,
        style:{
          width: width,
          height: height,
        }}
      )
    );
  }
});
/** @jsx React.DOM */
var RectangularSelectionTool = React.createClass({displayName: 'RectangularSelectionTool',
  render: function() {
    return (
      React.DOM.div( {id:"RectangularSelection-Tool", className:"ToolComponent"}, 
        React.DOM.i( {className:"icon flaticon-selection7"}),

        React.DOM.span( {className:"hint"}, "Select some pixels to work with!")
      )
    );
  }
});
/** @jsx React.DOM */
var SelectionPattern = React.createClass({displayName: 'SelectionPattern',
  getInitialState: function() {
    return {
      frame: 1,
      frameCountUp: true,
    };
  },
  render: function() {
    var size = this.props.editor.zoom;

    return (
      React.DOM.canvas( {id:"SelectionPattern", width:size, height:size, style:{height: size, width: size}} )
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
/** @jsx React.DOM */
var StageBox = React.createClass({displayName: 'StageBox',
  getInitialState: function() {
    return {
      //needsRefresh: false,
      mousedown: false,
      mousedownPoint: new Point(0, 0),
      last: null, // we need to record the mousedown timestamp because of a chrome bug,
                  // see https://code.google.com/p/chromium/issues/detail?id=161464
                  // and http://stackoverflow.com/questions/14538743/what-to-do-if-mousemove-and-click-events-fire-simultaneously
    };
  },
  render: function() {

    var w = this.props.editor.size.width*this.props.editor.zoom,
        h = this.props.editor.size.height*this.props.editor.zoom,
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
      React.DOM.div( {id:"StageBox",
        style:css,
        onMouseDown:this.mousedown,
        onMouseMove:this.mousemove,
        onMouseUp:this.mouseup}, 

        StageBoxCursorCanvas( {width:w, height:h, editor:this.props.editor} ),
        StageBoxSelectionCanvas( {width:w, height:h, editor:this.props.editor} ),
        StageBoxGridCanvas( {width:w, height:h, editor:this.props.editor} ),

        this.props.editor.layers.frame.map(function(layer) {
          var id = 'StageBoxLayer-'+layer.id;
          return (
            StageBoxLayer(
              {key:id,
              csswidth:w,
              cssheight:h, 
              width:this.props.editor.size.width,
              height:this.props.editor.size.width,
              id:layer.id,
              layer:layer} )
          );
        }, this)
      )
    );
  },
  componentDidMount: function() {
    this.subscriptions = [
      //channel.subscribe('app.frame.select', this.prepareRefresh),
      //channel.subscribe('stage.zoom.select', this.prepareRefresh),
    ];
  },
  /*
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      //stage.frame.refresh();

      this.setState({needsRefresh: false});
    }
  },
  */

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
      channel.publish('app.pixel.select', {point: point});
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
      if(!editor.selection.isActive) {
        channel.publish('stage.pixel.fill', {
          frame: editor.frame,
          layer: editor.layers.selected,
          x: editor.pixel.x,
          y: editor.pixel.y,
          color: editor.color.hexString()
        });
      }
      else { // restrict to selection
        if(editor.selection.contains(editor.pixel)) {
          channel.publish('stage.pixel.fill', {
            frame: editor.frame,
            layer: editor.layers.selected,
            x: editor.pixel.x,
            y: editor.pixel.y,
            color: editor.color.hexString()
          });
        }
      }
    }
  },
  useEraserTool: function() {
    if(isLayerVisible()) {
      if(!editor.selection.isActive) {
        channel.publish('stage.pixel.clear', {
          frame: editor.frame,
          layer: editor.layers.selected,
          x: editor.pixel.x,
          y: editor.pixel.y,
        });
      }
      else { // restrict to selection
        if(editor.selection.contains(editor.pixel)) {
          channel.publish('stage.pixel.clear', {
            frame: editor.frame,
            layer: editor.layers.selected,
            x: editor.pixel.x,
            y: editor.pixel.y,
          });
        }
      }
    }
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

      function lighten() {
        if(editor.layerPixelColor.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.layerPixelColor, editor.brightnessTool.intensity);
        channel.publish('stage.pixel.fill', {
          frame: editor.frame,
          layer: editor.layers.selected,
          x: editor.pixel.x,
          y: editor.pixel.y,
          color: newColor.hexString()
        });
      };

      function darken() {
        if(editor.layerPixelColor.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.layerPixelColor, -editor.brightnessTool.intensity);
        channel.publish('stage.pixel.fill', {
          frame: editor.frame,
          layer: editor.layers.selected,
          x: editor.pixel.x,
          y: editor.pixel.y,
          color: newColor.hexString()
        });
      };

      var px = _.findWhere(editor.pixels, {layer: editor.layers.selected, x: editor.pixel.x, y: editor.pixel.y }),
          pixelExists = !_.isUndefined(px);

      if(pixelExists) {
        if(!editor.selection.isActive) {
          if(editor.brightnessTool.mode == 'lighten') lighten();
          else if(editor.brightnessTool.mode == 'darken') darken();
        }
        else { // restrict to selection
          if(editor.selection.contains(editor.pixel)) {
            if(editor.brightnessTool.mode == 'lighten') lighten();
            else if(editor.brightnessTool.mode == 'darken') darken();
          }
        }
      }
    }
  },
  useMoveTool: function() {

    var distance = this.getMouseDownDistance(),
        canvas = document.getElementById('StageBoxLayer-'+editor.layers.selected);

    canvas.width = canvas.width;

    if(editor.selection.isActive) {

      this.updateRectangularSelection(distance);

      editor.selection.pixels.forEach(function(pixel) {
        var color = new Color('rgb('+pixel.r+', '+pixel.g+', '+pixel.b+')'),
            target = wrapPixel(pixel, distance);

        channel.publish('stage.pixel.fill', {
          frame: editor.frame,
          layer: editor.layers.selected,
          x: target.x,
          y: target.y,
          color: color.hexString()
        });
      });

      editor.pixels.forEach(function(pixel) {
        if(pixel.layer == editor.layers.selected) {
          var color = new Color('rgb('+pixel.r+', '+pixel.g+', '+pixel.b+')');
          channel.publish('stage.pixel.fill', {
            frame: editor.frame,
            layer: editor.layers.selected,
            x: pixel.x,
            y: pixel.y,
            color: color.hexString()
          });
        }
      });
    }
    else {
      editor.pixels.forEach(function(pixel) {
        if(pixel.layer == editor.layers.selected) {
          var color = new Color('rgb('+pixel.r+', '+pixel.g+', '+pixel.b+')'),
              target = wrapPixel(pixel, distance);

          channel.publish('stage.pixel.fill', {
            frame: editor.frame,
            layer: editor.layers.selected,
            x: target.x,
            y: target.y,
            color: color.hexString()
          });
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
/** @jsx React.DOM */
var StageBoxCursorCanvas = React.createClass({displayName: 'StageBoxCursorCanvas',
  mixins: [StageBoxCanvasMixin],
  render: function() {
    return (
      React.DOM.canvas( {id:"StageBoxCursorCanvas", className:"Layer", width:this.props.width, height:this.props.height} )
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
/** @jsx React.DOM */
var StageBoxGridCanvas = React.createClass({displayName: 'StageBoxGridCanvas',
  mixins: [StageBoxCanvasMixin],
  render: function() {
    return (
      React.DOM.canvas( {id:"StageBoxGridCanvas", className:"Layer", width:this.props.width, height:this.props.height} )
    );
  },
  componentDidMount: function() {
    if(this.props.editor.grid === true) this.drawGrid();
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
/** @jsx React.DOM */
var StageBoxLayer = React.createClass({displayName: 'StageBoxLayer',
  mixins:[ResetStateMixin, PostalSubscriptionMixin, LayerCanvasMixin],
  render: function() {
    var display = (this.props.layer.visible === true) ? 'block' : 'none';
    return (
      React.DOM.canvas(
        {id:this.props.key,
        className:"Layer",
        width:this.props.csswidth,
        height:this.props.cssheight,
        style:{
          zIndex: this.props.layer.z,
          opacity: this.props.layer.opacity/100,
          display: display,
          width: this.props.csswidth,
          height: this.props.cssheight
        }}
      )
    );
  },
});
/** @jsx React.DOM */
var StageBoxSelectionCanvas = React.createClass({displayName: 'StageBoxSelectionCanvas',
  mixins: [StageBoxCanvasMixin],
  render: function() {
    return (
      React.DOM.canvas( {id:"StageBoxSelectionCanvas", className:"Layer", width:this.props.width, height:this.props.height} )
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
/** @jsx React.DOM */
var StatusBar = React.createClass({displayName: 'StatusBar',
  render: function() {
    var cssClasses = (this.props.editor.grid === true ? 'active' : '') + ' tiny transparent',
        toggleGridTitle = 'Toggle grid ('+hotkeys.actions.toggleGrid.key+')';

    return (
      React.DOM.div( {id:"StatusBar"}, 
        React.DOM.span(null, "X: ", this.props.editor.pixel.x),
        React.DOM.span(null, "Y: ", this.props.editor.pixel.y),
        React.DOM.div( {id:"StatusBarColor", style:{background: this.props.editor.pixelColor.rgbaString()}}),
        React.DOM.span( {id:"StatusBarColorString"}, this.props.editor.pixelColor.alpha() == 0 ? 'transparent': this.props.editor.pixelColor.hexString()),
        React.DOM.span(null, "Frame ", this.props.editor.frame,", ", this.props.editor.pixels.length + this.props.editor.selection.pixels.length, " pixels"),
        " ",
        React.DOM.span(null, "Zoom ×",this.props.editor.zoom),
        React.DOM.div( {id:"StatusBarButtons"}, 
          React.DOM.button( {id:"toggleGrid", className:cssClasses, onClick:this.dispatchGridToggled, title:toggleGridTitle}, 
            React.DOM.i( {className:"flaticon-3x3"})
          )
        )
      )
    );
  },
  dispatchGridToggled: function(event) {
    channel.publish('stage.grid.toggle', {grid: !this.props.editor.grid});
  }
});
/** @jsx React.DOM */
var ToolBox = React.createClass({displayName: 'ToolBox',
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
      React.DOM.div( {id:"ToolBox"}, 
        React.DOM.h4(null, "Tools"),
        React.DOM.div(null, 
          ToolBoxTool( {id:"BrushTool", title:titles.brushTool, icon:"flaticon-small23", editor:this.props.editor} ),
          ToolBoxTool( {id:"EraserTool", title:titles.eraserTool, icon:"flaticon-double31", editor:this.props.editor} ),
          ToolBoxTool( {id:"EyedropperTool", title:titles.eyedropperTool, icon:"flaticon-eyedropper2", editor:this.props.editor} ),
          ToolBoxTool( {id:"RectangularSelectionTool", title:titles.rectangularSelectionTool, icon:"flaticon-selection7", editor:this.props.editor} ),
          ToolBoxTool( {id:"PaintBucketTool", title:titles.paintBucketTool, icon:"flaticon-paint2", editor:this.props.editor} ),
          ToolBoxTool( {id:"BrightnessTool", title:titles.brightnessTool, icon:"flaticon-sun4", editor:this.props.editor} ),
          ToolBoxTool( {id:"MoveTool", title:titles.moveTool, icon:"flaticon-move11", editor:this.props.editor} ),
          ToolBoxTool( {id:"ZoomTool", title:titles.zoomTool, icon:"flaticon-magnifier5", editor:this.props.editor} )
        )
      )
    );
  }
});
/** @jsx React.DOM */
var ToolBoxTool = React.createClass({displayName: 'ToolBoxTool',
  render: function() {
    var selected = this.props.id == this.props.editor.tool ? true : false;
    var cssClasses = 'ToolBoxTool transparent';
    if(selected) cssClasses+= ' active';

    return (
      React.DOM.button(
        {id:this.props.id,
        className:cssClasses,
        title:this.props.title,
        disabled:selected,
        onClick:this.dispatchToolSelected.bind(this, this.props.id)}, 
          React.DOM.i( {className:this.props.icon})
      )
    );
  },
  dispatchToolSelected: function(tool) {
    channel.publish('app.tool.select', {tool: tool});
  }
});
/** @jsx React.DOM */
var ToolContainer = React.createClass({displayName: 'ToolContainer',
  render: function() {
    return window[this.props.editor.tool](this.props);
  }
});
/** @jsx React.DOM */
var ZoomTool = React.createClass({displayName: 'ZoomTool',
  render: function() {

    var zoom = editor.zoom;
    return (
      React.DOM.div( {id:"Zoom-Tool", className:"ToolComponent"}, 
        React.DOM.i( {className:"icon flaticon-magnifier5"}),
        React.DOM.button( {onClick:this.zoomIn, className:"small", title:"Zoom in"}, React.DOM.i( {className:"flaticon-plus25"})),
        React.DOM.button( {onClick:this.zoomOut, className:"small", title:"Zoom out"}, React.DOM.i( {className:"flaticon-minus18"})),
        React.DOM.input( {type:"range", min:"1", max:"50", className:"zoom-slider", value:this.props.editor.zoom, onChange:this.dispatchZoomChanged} ),
        React.DOM.span(null, "Zoom ×"),
        React.DOM.input( {type:"number", min:"1", max:"50", className:"zoom-number", value:this.props.editor.zoom, onChange:this.dispatchZoomChanged} ),
        React.DOM.button( {onClick:this.fitToScreen, className:"small"}, "Fit to screen"),
        React.DOM.span( {className:"spacer"}),
        React.DOM.span( {className:"hint"}, "A pixel in your sprite is now ", this.props.editor.zoom, " pixels on your screen.")
      )
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
/** @jsx React.DOM */
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
      channel.publish('stage.pixel.fill', {
        frame: file.getFrameIdForLayer(pixel.layer),
        layer: pixel.layer,
        x: pixel.x,
        y: pixel.y,
        color: color.hexString()
      });
    }
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
        //{ topic: "stage.pixel.fill" },
        //{ topic: "stage.pixel.clear" },
        { topic: "app.frame.select" },
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

  //workspace.load();

  // load file
  file.fromJSONString(savedFile);

  // init auto palette
  editor.palettes.buildAuto();




  /*
  // draw all pixels to layers
  file.pixels.forEach(function(px) {
    var color = new Color('rgba('+px.r+','+px.g+','+px.b+','+px.a+')');
    channel.publish('stage.pixel.fill', {
      frame: file.getFrameIdForLayer(px.layer),
      layer: px.layer,
      x: px.x,
      y: px.y,
      color: color.hexString()
    });
  });
  */

  // select each frame once to initialize previews etc
  /*
  var totalFrames = file.frames.x * file.frames.y,
      frame = editor.frame;
  for(var i = 1; i <= totalFrames; i++) {
    channel.publish('app.frame.select', {frame: i});
  }
  */

  //channel.publish('app.frame.select', {frame: frame});
  channel.publish('app.frame.select', {frame: 1});
  /*

  // select top-most layer
  editor.layers.selectTop();

  // set inital zoom
  channel.publish('stage.zoom.select', {zoom: editor.zoom});

  // select brush tool
  channel.publish('app.tool.select', {tool: editor.tool});
  */

  //setInterval(minutely, 60000);

  // render app
  React.renderComponent(
    App( {editor:editor, workspace:workspace} )
    , document.body);
};

