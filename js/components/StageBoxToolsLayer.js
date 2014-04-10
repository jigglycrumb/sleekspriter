var StageBoxToolsLayer = React.createClass({
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
    this.getDOMNode().addEventListener('mousemove', this.mousemove);
  },
  componentDidUpdate: function() {

    // called after mousemove
    // all the canvas drawing happens here

    // clear the canvas
    this.getDOMNode().width = this.getDOMNode().width;

    // helper functions
    function isLayerVisible() {
      var layer = file.getLayerById(self.props.editor.layer);
      return layer.visible && layer.opacity > 0;
    }

    function drawLastSelection() {
      self.drawSelection(self.props.editor.selection.start, self.props.editor.selection.end);
    }

    // cache some values
    var self = this,
        selectionActive = this.props.editor.selectionActive(),
        layerVisible = isLayerVisible();

    if(this.props.editor.grid === true) {
      this.drawGrid();
    }

    if(this.state.mousedown) {
      switch(this.props.editor.tool) {
        case 'BrushTool':
          if(layerVisible) {
            if(selectionActive) { // restrict to selection
              drawLastSelection();
              if(editor.selectionContains(editor.pixel)) stage.pixel.fill();
            }
            else stage.pixel.fill();
          }
          else {
            this.mouseup(); // prevent additional alerts
            alert('You are trying to paint on an invisible layer. Please make the layer visible and try again.');
          }
          break;
        case 'EraserTool':
          if(layerVisible) {
            if(selectionActive) { // restrict to selection
              drawLastSelection();
              if(editor.selectionContains(editor.pixel)) stage.pixel.clear();
            }
            else stage.pixel.clear();
          }
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
          if(layerVisible) {

            var px = _.findWhere(editor.pixels, {layer: editor.layer, x: editor.pixel.x, y: editor.pixel.y }),
                pixelExists = !_.isUndefined(px);

            if(selectionActive) { // restrict to selection
              drawLastSelection();
              if(pixelExists && editor.selectionContains(editor.pixel)) {
                if(editor.brightnessToolMode == 'lighten') stage.pixel.lighten();
                else if(editor.brightnessToolMode == 'darken') stage.pixel.darken();
              }
            }
            else if(pixelExists) {
              if(editor.brightnessToolMode == 'lighten') stage.pixel.lighten();
              else if(editor.brightnessToolMode == 'darken') stage.pixel.darken();
            }
          }
          else {
            this.mouseup(); // prevent additional alerts
            alert('You are trying to paint on an invisible layer. Please make the layer visible and try again.');
          }
          break;
        case 'RectangularSelectionTool':
          if(selectionActive) { // previous selection available
                                // we move it instead of drawing a new one
            var distance = new Point(
              editor.pixel.x - this.state.mousedownPoint.x,
              editor.pixel.y - this.state.mousedownPoint.y
            );

            var newStart = new Point(
              editor.selection.start.x + distance.x,
              editor.selection.start.y + distance.y
            );

            var newEnd = new Point(
              editor.selection.end.x + distance.x,
              editor.selection.end.y + distance.y
            );

            this.drawSelection(newStart, newEnd);
          }
          else { // no previous selection, draw new selection from start to cursor
            this.drawSelection(editor.selection.start, editor.pixel);
          }
          break;
      }
    }
    else { // mouse is not down
      if(selectionActive) {
        drawLastSelection();
      }
    }

    this.drawPixelCursor();
  },
  mousemove: function(event) {
    //console.log('mousemove');

    this.getLayerPixelColor();

    if(event.timeStamp > this.state.last + 10) {
      var point = this.getWorldCoordinates(event);
      this.props.signal.pixelSelected.dispatch(point);
    }
  },
  mousedown: function(event) {
    //console.log('mousedown');

    var point = this.getWorldCoordinates(event);

    switch(this.props.editor.tool) {
      case 'RectangularSelectionTool':
        if(!editor.selection || !editor.selectionContains(point))
          this.props.signal.selectionStarted.dispatch(point);
        break;
    }

    this.setState({mousedown: true, mousedownPoint: point, last: event.timeStamp});
  },
  mouseup: function(event) {
    //console.log('mouseup');

    var point = this.getWorldCoordinates(event);

    switch(this.props.editor.tool) {
      case 'RectangularSelectionTool':
        if(editor.selectionActive()) {
          var distance = new Point(
            point.x - this.state.mousedownPoint.x,
            point.y - this.state.mousedownPoint.y
          );
          this.props.signal.selectionMoved.dispatch(distance);
        }
        else {
          if(_.isEqual(point, this.state.mousedownPoint))
            this.props.signal.selectionCleared.dispatch();
          else
            this.props.signal.selectionEnded.dispatch(point);
        }
        break;
    }

    this.setState({mousedown: false});
  },
  mouseleave: function() {
    this.props.signal.pixelSelected.dispatch(new Point(0, 0));
  },
  getLayerPixelColor: function() {
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

    if(zoom < 3) return;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#cccccc";

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
  },
  drawSelection: function(start, end) {
    var canvas = this.getDOMNode(),
        zoom = this.props.editor.zoom,
        ctx = canvas.getContext('2d'),
        width = (end.x - start.x),
        height = (end.y - start.y),
        sx,
        sy;

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

    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "#0433FF";
    ctx.fillStyle = "#88E6F2";

    ctx.fillRect(sx*zoom, sy*zoom, width*zoom, height*zoom);
    ctx.strokeRect(sx*zoom+0.5, sy*zoom+0.5, width*zoom, height*zoom);

    ctx.globalAlpha = 1;
  },
});