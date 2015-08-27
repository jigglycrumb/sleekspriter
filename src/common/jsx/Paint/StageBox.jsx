var StageBox = React.createClass({
  mixins: [FluxMixin],
  getInitialState: function() {
    return {
      mousedown: false,
      mousedownPoint: new Point(0, 0),
      last: null, // we need to record the mousedown timestamp because of a chrome bug,
                  // see https://code.google.com/p/chromium/issues/detail?id=161464
                  // and http://stackoverflow.com/questions/14538743/what-to-do-if-mousemove-and-click-events-fire-simultaneously
    };
  },
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

    if( h > centerAreaHeight ) css.top = 0;
    else css.top = (centerAreaHeight - h)/2;

    var background = null;
    if(this.props.image === null) {
      background = <StageBoxBackground type={this.props.ui.background.type} value={this.props.ui.background.value} />
    }

    return (
      <div id="StageBox"
        style={css}
        onMouseDown={this.mousedown}
        onMouseMove={this.mousemove}
        onMouseUp={this.mouseup}>

        <StageBoxCursorCanvas width={w} height={h} ui={this.props.ui} />
        <StageBoxSelectionCanvas width={w} height={h} ui={this.props.ui} />
        <StageBoxGridCanvas width={w} height={h} ui={this.props.ui} />

        {this.props.ui.layers.frame.map(function(layer) {
          return (
            <StageBoxLayer
              key={layer.id}
              width={w}
              height={h}
              id={layer.id}
              layer={layer}
              stage={true}
              ui={this.props.ui} />
          );
        }, this)}

        {background}
      </div>
    );
  },

  mousedown: function(event) {

    event = event.nativeEvent;

    var point = this.getWorldCoordinates(event),
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

    if(ok) this.setState({mousedown: true, mousedownPoint: point, last: event.timeStamp});
  },

  mousemove: function(event) {

    event = event.nativeEvent;

    //this.getLayerPixelColor(event);

    var point = this.getWorldCoordinates(event),
        distance = this.getMouseDownDistance();

    if(event.timeStamp > this.state.last + 10 && point.x > 0 && point.y > 0) {
      this.getFlux().actions.cursorSet(point);
    }

    if(this.state.mousedown === true) {

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

    event = event.nativeEvent;

    var point = this.getWorldCoordinates(event),
        distance = this.getMouseDownDistance(),
        ok = true;

    this.setState({mousedown: false});

    switch(this.props.ui.tool) {

      case 'EyedropperTool':
        this.useEyedropperTool();
        break;

      case 'RectangularSelectionTool':
        this.endRectangularSelection(point, distance);
        break;

      case 'PaintBucketTool':
        ok = this.usePaintBucketTool(point);
        break;

      case 'MoveTool':
        this.useMoveTool(point);
        break;
    }

    // if(ok) this.props.editor.pixels.save();
  },

  getLayerPixelColor: function(event) {
    var ctx = document.getElementById('StageBoxLayer-'+this.props.ui.layers.selected).getContext('2d'),
        px = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data,
        color = new Color({r:px[0], g:px[1], b:px[2], a:px[3]});

    this.getFlux().actions.colorLayer(color.hexString());
  },
  getWorldCoordinates: function(event) {
    return new Point(
      Math.ceil(event.layerX/this.props.ui.zoom.selected),
      Math.ceil(event.layerY/this.props.ui.zoom.selected)
    );
  },
  getMouseDownDistance: function() {
    return new Point(
      this.props.ui.cursor.x - this.state.mousedownPoint.x,
      this.props.ui.cursor.y - this.state.mousedownPoint.y
    );
  },







  useBrushTool: function() {
    if(isLayerVisible()) {
      if(!storeUtils.selection.isActive) {
        Pixel.add(this.props.ui.frames.selected, this.props.ui.layers.selected, this.props.ui.cursor.x, this.props.ui.cursor.y,
                      storeUtils.layers.getSelected().z, this.props.ui.color.brush.hexString());
      }
      else { // restrict to selection
        if(storeUtils.selection.contains(this.props.ui.cursor)) {
          Pixel.add(this.props.ui.frames.selected, this.props.ui.layers.selected, this.props.ui.cursor.x, this.props.ui.cursor.y,
                        storeUtils.layers.getSelected().z, this.props.ui.color.brush.hexString());
        }
      }
      return true;
    }
    else return this.showInvisibleLayerError();
  },
  useEraserTool: function() {
    if(isLayerVisible()) {
      if(!storeUtils.selection.isActive) {
        Pixel.delete(this.props.ui.frames.selected, this.props.ui.layers.selected,
                     this.props.ui.cursor.x, this.props.ui.cursor.y,
                     storeUtils.layers.getSelected().z);
      }
      else { // restrict to selection
        if(storeUtils.selection.contains(this.props.ui.cursor)) {
          Pixel.delete(this.props.ui.frames.selected, this.props.ui.layers.selected,
                       this.props.ui.cursor.x, this.props.ui.cursor.y,
                       storeUtils.layers.getSelected().z);
        }
      }
      return true;
    }
    else return this.showInvisibleLayerError();
  },
  useEyedropperTool: function() {
    if(this.props.ui.color.frame.alpha() == 0) return; // skip transparent pixels
    this.getFlux().actions.toolSelect('BrushTool');
    this.getFlux().actions.colorBrush(this.props.ui.color.frame.hexString());
  },
  usePaintBucketTool: function(point) {
    if(isLayerVisible()) {
      if(storeUtils.selection.isActive) {
        if(storeUtils.selection.contains(point)) channel.gui.publish('stage.tool.paintbucket', {point: point});
      }
      else channel.gui.publish('stage.tool.paintbucket', {point: point});
      return true;
    }
    else return this.showInvisibleLayerError();
  },
  useBrightnessTool: function() {

    if(isLayerVisible()) {

      function lighten() {
        if(this.props.ui.color.layer.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(this.props.ui.color.layer, this.props.ui.brightnessTool.intensity);
        Pixel.add(this.props.ui.frames.selected, this.props.ui.layers.selected, this.props.ui.cursor.x, this.props.ui.cursor.y,
              storeUtils.layers.getSelected().z, newColor.hexString());
      };

      function darken() {
        if(this.props.ui.color.layer.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(this.props.ui.color.layer, -this.props.ui.brightnessTool.intensity);
        Pixel.add(this.props.ui.frames.selected, this.props.ui.layers.selected, this.props.ui.cursor.x, this.props.ui.cursor.y,
              storeUtils.layers.getSelected().z, newColor.hexString());
      };

      var px = _.findWhere(this.props.ui.pixels.scope, {x: this.props.ui.cursor.x, y: this.props.ui.cursor.y }),
          pixelExists = !_.isUndefined(px);

      if(pixelExists) {
        if(!storeUtils.selection.isActive) {
          if(this.props.ui.brightnessTool.mode == 'lighten') lighten();
          else if(this.props.ui.brightnessTool.mode == 'darken') darken();
        }
        else { // restrict to selection
          if(storeUtils.selection.contains(this.props.ui.cursor)) {
            if(this.props.ui.brightnessTool.mode == 'lighten') lighten();
            else if(this.props.ui.brightnessTool.mode == 'darken') darken();
          }
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

    this.props.ui.pixels.frame.forEach(function(px) {
      if(px.layer === this.props.ui.layers.selected) pixels.push(px);
    }, this);

    this.props.ui.pixels.scope.forEach(function(px) {
      pixels.push(px.wrap(distance, true));
    });

    channel.gui.publish('canvas.preview', {
      frame: this.props.ui.frames.selected,
      layer: this.props.ui.layers.selected,
      pixels: pixels,
    });
  },
  useMoveTool: function(distance) {
    channel.gui.publish('pixels.move', {distance: distance});
    if(storeUtils.selection.isActive) {
      this.getFlux().actions.selectionMove(distance);
      this.getFlux().actions.scopeSet(this.props.ui.layers.selected, 'selection', this.props.ui.selection);
    }
  },




  startRectangularSelection: function(point) {
    if(!storeUtils.selection.isActive || !storeUtils.selection.contains(point)) {
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
      if(_.isEqual(point, this.state.mousedownPoint)) {
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

});