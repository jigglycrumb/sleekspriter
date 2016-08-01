var StageBox = React.createClass({
  mixins: [FluxMixin],
  touched: false,
  cursor: {
    x: 0,
    y: 0,
  },
  cursorColor: 'transparent',
  css: {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  },
  mouse: {
    down: false,
    downPoint: {x: 0, y: 0},
    last: null, // we need to record the mousedown timestamp because of a chrome bug,
                // see https://code.google.com/p/chromium/issues/detail?id=161464
                // and http://stackoverflow.com/questions/14538743/what-to-do-if-mousemove-and-click-events-fire-simultaneously
  },
  pixels: [], // temporary holds pixels until the end of the tool usage (currently touch only)
  render: function() {

    var w = this.props.file.size.width * this.props.ui.zoom.selected,
        h = this.props.file.size.height * this.props.ui.zoom.selected,
        centerAreaWidth = window.innerWidth - this.props.ui.offset.left - this.props.ui.offset.right,
        centerAreaHeight = window.innerHeight - this.props.ui.offset.top - this.props.ui.offset.bottom;

    var css = {
      width: w,
      height: h,
    };

    if( w > centerAreaWidth ) css.left = 0;
    else css.left = (centerAreaWidth - w)/2;

    if(css.left < 5) css.left = 5;

    if( h > centerAreaHeight ) css.top = 0;
    else css.top = (centerAreaHeight - h)/2;

    if(css.top < 5) css.top = 5;

    var onionFrame = null;
    if(this.props.ui.onion.active === true) {
      onionFrame =
        <div id="StageBoxOnionCanvas" className="Layer">
          <FrameCanvas frame={storeUtils.onion.getActualFrame()} file={this.props.file} pixels={this.props.pixels} zoom={this.props.ui.zoom.selected} />
        </div>;
    }

    var cssClasses = {
      checkerboard: this.props.image === null ? true : false,
    };

    this.css = css;

    return (
      <div id="StageBox"
        className={classNames(cssClasses)}
        style={css}
        onMouseDown={this.mousedown}
        onMouseMove={this.mousemove}
        onMouseUp={this.mouseup}
        onTouchStart={this.touchstart}
        onTouchMove={this.touchmove}
        onTouchEnd={this.touchend}>

        <StageBoxCursorCanvas ref="cursorCanvas" width={w} height={h} zoom={this.props.ui.zoom.selected} />
        <StageBoxSelectionCanvas width={w} height={h} ui={this.props.ui} />
        <StageBoxGridCanvas width={w} height={h} ui={this.props.ui} />

        {this.props.ui.layers.frame.map(function(layer) {
          return (
            <StageBoxLayer
              key={layer.id}
              layer={layer}
              ui={this.props.ui}
              file={this.props.file}
              pixels={this.props.pixels}
              ref={'layer_' + layer.id} />
          );
        }, this)}

        {onionFrame}
      </div>
    );
  },

  // Mouse handlers

  mousedown: function(event) {
    if(this.touched) return false;

    event = event.nativeEvent;

    var point = this.getClickCoordinates(event),
        ok = true;

    switch(this.props.ui.tool) {

      case 'BrushTool':
        ok = this.useBrushTool();
        break;

      case 'EraserTool':
        ok = this.useEraserTool();
        break;

      case 'BrightnessTool':
        ok = this.useBrightnessTool();
        break;

      case 'RectangularSelectionTool':
        this.startRectangularSelection(point);
        break;
    }

    if(ok) this.mouse = {
      down: true,
      downPoint: point,
      last: event.timeStamp
    };
  },

  mousemove: function(event) {
    if(this.touched) return false;

    event = event.nativeEvent;
    var point = this.getClickCoordinates(event),
        distance = this.getMouseDownDistance();

    if(event.timeStamp > this.mouse.last + 10) {
      this.updateCursor(point);
    }

    if(this.mouse.down === true) {
      switch(this.props.ui.tool) {

        case 'BrushTool':
          this.useBrushTool();
          break;

        case 'EraserTool':
          this.useEraserTool();
          break;

        case 'RectangularSelectionTool':
          if(storeUtils.selection.isActive) this.previewRectangularSelection(distance);
          else this.resizeRectangularSelection(point);
          break;

        case 'BrightnessTool':
          this.useBrightnessTool();
          break;

        case 'MoveTool':
          this.previewMoveTool();
          break;
      }
    }
  },

  mouseup: function(event) {
    if(this.touched) return false;

    event = event.nativeEvent;

    var point = this.getClickCoordinates(event),
        distance = this.getMouseDownDistance();

    this.mouse.down = false;

    switch(this.props.ui.tool) {

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
        this.applyMoveTool(distance);
        break;
    }
  },


  // Touch handlers

  touchstart: function(event) {

    var coords = event.touches[0],
        point = this.getTouchCoordinates(event);

    this.touched = true;
    this.updateCursor(point);

    // console.log('touchstart', point, event.touches[0]);

    switch(this.props.ui.tool) {
      case 'BrushTool':
        this.touchBrushTool();
        // console.log(this.pixels);
        break;
    }
  },

  touchmove: function(event) {

    var coords = event.touches[0],
        point = this.getTouchCoordinates(event),
        oldCursor = this.cursor;

    this.updateCursor(point);

    if(this.cursor.x != oldCursor.x && this.cursor.y != oldCursor.y) {
      switch(this.props.ui.tool) {
        case 'BrushTool':
          this.touchBrushTool();
          // console.log(this.pixels);
          break;
      }
    }

    // console.log('touchmove', point, event.touches[0]);
  },

  touchend: function(event) {
    // console.log('touchend', event);

    var coords = event.touches[0],
        point = this.getTouchCoordinates(event);

    switch(this.props.ui.tool) {
      case 'BrushTool':
        this.flux.actions.pixelsAdd(this.pixels);
        this.pixels = [];
        break;

    }

    // this.refs.cursorCanvas.clear();
  },

  getLayerPixelColor: function(point) {
    var ctx = document.querySelector('#LayerHelper canvas').getContext('2d'),
        px = ctx.getImageData(point.x-1, point.y-1, 1, 1).data,
        color = new Color({r:px[0], g:px[1], b:px[2], a:px[3]});
    return color;
  },

  getFramePixelColor: function(point) {
    var ctx = document.querySelector('#FrameHelper canvas').getContext('2d'),
        px = ctx.getImageData(point.x-1, point.y-1, 1, 1).data,
        color = new Color({r:px[0], g:px[1], b:px[2], a:px[3]});
    return color;
  },

  getClickCoordinates: function(event) {
    return new Point(
      Math.ceil(event.layerX / this.props.ui.zoom.selected),
      Math.ceil(event.layerY / this.props.ui.zoom.selected)
    );
  },

  getTouchCoordinates: function(event) {
    var touch = event.touches[0],
        offset = {
          x: this.css.left + this.props.ui.offset.left,
          y: this.css.top + this.props.ui.offset.left
        };

    return new Point(
      Math.ceil((event.touches[0].pageX - offset.x) / this.props.ui.zoom.selected),
      Math.ceil((event.touches[0].pageY - offset.y) / this.props.ui.zoom.selected)
    );
  },

  getMouseDownDistance: function() {
    return new Point(
      this.cursor.x - this.mouse.downPoint.x,
      this.cursor.y - this.mouse.downPoint.y
    );
  },







  useBrushTool: function() {
    if(storeUtils.layers.isVisible) {
      if(!storeUtils.selection.isActive || storeUtils.selection.contains(this.cursor)) {
        this.getFlux().actions.pixelAdd(this.props.ui.frames.selected,
                                        this.props.ui.layers.selected,
                                        this.cursor.x, this.cursor.y,
                                        storeUtils.layers.getSelected().z,
                                        this.props.ui.color.brush.hexString());
      }
      return true;
    }
    else return this.showInvisibleLayerError();
  },

  touchBrushTool: function() {
    if(storeUtils.layers.isVisible) {
      if(!storeUtils.selection.isActive || storeUtils.selection.contains(this.cursor)) {
        var px = new Pixel(
          this.props.ui.frames.selected,
          this.props.ui.layers.selected,
          this.cursor.x,
          this.cursor.y,
          this.props.ui.color.brush.red(),
          this.props.ui.color.brush.green(),
          this.props.ui.color.brush.blue(),
          this.props.ui.color.brush.alpha(),
          storeUtils.layers.getSelected().z
        );

        this.pixels.push(px);

        var layerCanvas = this.refs['layer_' + this.props.ui.layers.selected].refs.layerCanvas;
        layerCanvas.paintPixel({x: px.x, y: px.y, layer: this.props.ui.layers.selected, color: px.toHex()});
      }
      return true;
    }
    else return this.showInvisibleLayerError();
  },

  useEraserTool: function() {
    if(storeUtils.layers.isVisible) {
      if(!storeUtils.selection.isActive || storeUtils.selection.contains(this.cursor)) {
        this.getFlux().actions.pixelDelete(this.props.ui.frames.selected, this.props.ui.layers.selected, this.cursor.x, this.cursor.y);
      }
      return true;
    }
    else return this.showInvisibleLayerError();
  },

  useEyedropperTool: function() {
    if(this.cursorColor == 'transparent') return;
    this.getFlux().actions.toolSelect('BrushTool');
    this.getFlux().actions.colorBrush(this.cursorColor);
  },

  usePaintBucketTool: function(point) {
    if(storeUtils.layers.isVisible) {
      if(!storeUtils.selection.isActive || storeUtils.selection.contains(point)) {
        this.getFlux().actions.paintbucket(point);
      }
      return true;
    }
    else return this.showInvisibleLayerError();
  },

  useBrightnessTool: function() {

    function lighten() {
      if(this.cursorColor == 'transparent') return;
      var newColor = changeColorLightness(this.props.ui.color.layer, this.props.ui.brightnessTool.intensity);
      this.getFlux().actions.pixelAdd(this.props.ui.frames.selected, this.props.ui.layers.selected, this.cursor.x, this.cursor.y,
            storeUtils.layers.getSelected().z, newColor.hexString());
    }

    function darken() {
      if(this.cursorColor == 'transparent') return;
      var newColor = changeColorLightness(this.props.ui.color.layer, -this.props.ui.brightnessTool.intensity);
      this.getFlux().actions.pixelAdd(this.props.ui.frames.selected, this.props.ui.layers.selected, this.cursor.x, this.cursor.y,
            storeUtils.layers.getSelected().z, newColor.hexString());
    }

    if(storeUtils.layers.isVisible) {

      var px = _.find(this.props.pixels.scope, {x: this.props.ui.cursor.x, y: this.props.ui.cursor.y }),
          pixelExists = !_.isUndefined(px);

      if(pixelExists) {
        if(!storeUtils.selection.isActive || storeUtils.selection.contains(this.props.ui.cursor)) {
          if(this.props.ui.brightnessTool.mode == 'lighten') lighten.call(this);
          else if(this.props.ui.brightnessTool.mode == 'darken') darken.call(this);
        }
      }
      return true;
    }
    else return this.showInvisibleLayerError();
  },




  previewMoveTool: function() {
    var distance = this.getMouseDownDistance(),
        canvas = document.getElementById('StageBoxLayer-'+this.props.ui.layers.selected),
        pixels = [];

    if(storeUtils.selection.isActive) this.previewRectangularSelection(distance);

    this.props.pixels.frame.forEach(function(px) {
      pixels.push(px);
    }, this);

    this.props.pixels.scope.forEach(function(px) {
      pixels.push(px.wrap(distance, true));
    });

    this.getFlux().actions.previewMoveTool(this.props.ui.frames.selected, this.props.ui.layers.selected, pixels);
  },

  applyMoveTool: function(distance) {
    this.getFlux().actions.pixelsMove(distance);
    if(storeUtils.selection.isActive) {
      this.getFlux().actions.selectionMove(distance);
      this.getFlux().actions.scopeSet(this.props.ui.layers.selected, 'selection', this.props.ui.selection);
    }
  },

  startRectangularSelection: function(point) {
    if(!storeUtils.selection.isActive || !storeUtils.selection.contains(point)) {
      this.getFlux().actions.selectionClear();
      this.getFlux().actions.scopeSet(this.props.ui.layers.selected, 'layer', this.props.ui.layers.selected);
      this.getFlux().actions.selectionStart(point);
    }
  },

  resizeRectangularSelection: function(point) {
    this.getFlux().actions.selectionResize(point);
  },

  previewRectangularSelection: function(distance) {
    this.getFlux().actions.selectionPreview(distance);
  },

  endRectangularSelection: function(point, distance) {
    if(storeUtils.selection.isActive) {
      this.getFlux().actions.selectionMove(distance);
      this.getFlux().actions.scopeSet(this.props.ui.layers.selected, 'selection', this.props.ui.selection);
    }
    else {
      if(_.isEqual(point, this.mouse.downPoint)) {
        this.getFlux().actions.selectionClear();
        this.getFlux().actions.scopeSet(this.props.ui.layers.selected, 'layer', this.props.ui.layers.selected);
      }
      else {
        this.getFlux().actions.selectionEnd(point);
        this.getFlux().actions.scopeSet(this.props.ui.layers.selected, 'selection', this.props.ui.selection);
      }
    }
  },

  showInvisibleLayerError: function() {
    this.getFlux().actions.modalShow(ModalErrorInvisibleLayer);
    return false;
  },



  updateCursor: function(point) {
    if((point.x > 0 && point.y > 0) &&
    (point.x !== this.cursor.x || point.y !== this.cursor.y)) {

      // update cursor position
      this.cursor = point;
      this.refs.cursorCanvas.drawPixelCursor(point.x, point.y);

      document.getElementById("StatusBarCursorX").innerHTML = "X: " + point.x;
      document.getElementById("StatusBarCursorY").innerHTML = "Y: " + point.y;

      // update color under cursor
      var cursorColorHex, cursorColorRGB;
      try {
        var currentPixel = this.props.pixels.dict[this.props.ui.frames.selected][this.props.ui.layers.selected][point.x][point.y];
        cursorColorHex = currentPixel.toHex();
        cursorColorRGB = currentPixel.toRgbHuman();
      } catch(e) {
        cursorColorHex = 'transparent';
        cursorColorRGB = '-, -, -';
      }

      document.getElementById('StatusBarColor').style.backgroundColor = cursorColorHex;
      document.getElementById('StatusBarColorString').innerHTML = cursorColorHex;

      this.cursorColor = cursorColorHex;

      if(this.props.ui.tool == 'EyedropperTool') {
        document.getElementById('EyedropperSwatch').style.backgroundColor = cursorColorHex;
        document.getElementById('EyedropperHex').innerHTML = cursorColorHex;
        document.getElementById('EyedropperRGB').innerHTML = cursorColorRGB;
      }
    }
  },

});
