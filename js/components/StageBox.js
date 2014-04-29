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
      <div id="StageBox"
        style={{width: w, height: h, left: cssleft, top: csstop}}
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
            <StageBoxLayer key={id} width={w} height={h} layer={layer} visible={visible} />
          );
        }, this)}
      </div>
    );
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
      this.props.signal.pixelSelected.dispatch(point);
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
          if(editor.selectionActive()) this.updateRectangularSelection(distance);
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
        selectionActive = editor.selectionActive();

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
        this.props.signal.pixelsMoved.dispatch(distance);
        if(selectionActive) this.props.signal.selectionMoved.dispatch(distance);
        break;


    }
  },





  getLayerPixelColor: function(event) {
    var layer = file.getLayerById(this.props.editor.layer),
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
      if(!editor.selectionActive()) stage.pixel.fill();
      else { // restrict to selection
        if(editor.selectionContains(editor.pixel)) stage.pixel.fill();
      }
    }
    //else {
    //  this.mouseup(); // prevent additional alerts
    //  alert('You are trying to paint on an invisible layer. Please make the layer visible and try again.');
    //}
  },
  useEraserTool: function() {
    if(isLayerVisible()) {
      if(!editor.selectionActive()) stage.pixel.clear();
      else { // restrict to selection
        if(editor.selectionContains(editor.pixel)) stage.pixel.clear();
      }
    }
    // else {
      // this.mouseup();  // prevent additional alerts
      // alert('You are trying to erase on an invisible layer. Please make the layer visible and try again.');
    // }
  },
  useEyedropperTool: function() {
    this.props.signal.toolSelected.dispatch('BrushTool');
    this.props.signal.colorSelected.dispatch(editor.pixelColor.hexString());
  },
  usePaintBucketTool: function(point) {
    if(isLayerVisible()) {
      if(editor.selectionActive()) {
        if(editor.selectionContains(point)) this.props.signal.bucketUsed.dispatch(point);
      }
      else this.props.signal.bucketUsed.dispatch(point);
    }
  },
  useBrightnessTool: function() {
    if(isLayerVisible()) {

      var px = _.findWhere(editor.pixels, {layer: editor.layer, x: editor.pixel.x, y: editor.pixel.y }),
          pixelExists = !_.isUndefined(px);

      if(pixelExists) {
        if(!editor.selectionActive()) {
          if(editor.brightnessToolMode == 'lighten') stage.pixel.lighten();
          else if(editor.brightnessToolMode == 'darken') stage.pixel.darken();
        }
        else { // restrict to selection
          if(editor.selectionContains(editor.pixel)) {
            if(editor.brightnessToolMode == 'lighten') stage.pixel.lighten();
            else if(editor.brightnessToolMode == 'darken') stage.pixel.darken();
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
    var layer = editor.layer,
        distance = this.getMouseDownDistance(),
        canvas = document.getElementById('StageBoxLayer-'+layer),
        ctx = canvas.getContext('2d');

    canvas.width = canvas.width;

    if(editor.selectionActive()) {

      this.updateRectangularSelection(distance);

      editor.pixels.forEach(function(pixel) {
        if(pixel.layer == layer) {
          var color = new Color('rgb('+pixel.r+', '+pixel.g+', '+pixel.b+')');
          if(editor.selectionContains(pixel)) {
            var target = wrapPixel(pixel, distance);
            stage.pixel.fill(layer, target.x, target.y, color);
          }
          else
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
    if(!editor.selection || !editor.selectionContains(point))
      this.props.signal.selectionStarted.dispatch(point);
  },
  resizeRectangularSelection: function(point) {
    this.props.signal.selectionResized.dispatch(point);
  },
  updateRectangularSelection: function(distance) {
    this.props.signal.selectionUpdated.dispatch(distance);
  },
  endRectangularSelection: function(point, distance) {
    if(editor.selectionActive()) {
      this.props.signal.selectionMoved.dispatch(distance);
    }
    else {
      if(_.isEqual(point, this.state.mousedownPoint))
        this.props.signal.selectionCleared.dispatch();
      else
        this.props.signal.selectionEnded.dispatch(point);
    }
  },

});