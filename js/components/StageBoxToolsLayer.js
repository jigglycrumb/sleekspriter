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
    this.getDOMNode().addEventListener('mousemove', this.mousemove);

    //this.props.signal.toolSelected.add(this.mouseup);
    this.props.signal.pixelSelected.add(this.getLayerPixelColor);
  },
  componentDidUpdate: function() {

    this.getDOMNode().width = this.getDOMNode().width;

    if(this.props.editor.grid === true) {
      this.drawGrid();
    }

    if(editor.selection.start instanceof Point && editor.selection.end instanceof Point) {
      this.drawSelection(editor.selection.start, editor.selection.end);
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
        case 'RectangularSelectionTool':
          if(editor.selection) {
            this.drawSelection(editor.selection.start, editor.pixel);
          }

          break;
      }
    }
  },
  mousemove: function(event) {
    console.log('mousemove');

    if(event.timeStamp > this.state.last + 10) {
      var world = this.getWorldCoordinates(event);
      this.props.signal.pixelSelected.dispatch(world);
    }
  },
  mousedown: function(event) {
    console.log('mousedown');

    switch(this.props.editor.tool) {
      case 'RectangularSelectionTool':
        var point = this.getWorldCoordinates(event);
        if(!editor.selection) { // start new selection
          console.log('no selection found, starting new selection');
          this.props.signal.selectionStarted.dispatch(point);
        }
        else { // a selection exists already
          // check if mouse is inside the existing selection
          if(editor.selectionContains(point)) { // inside selection: move selection
            console.log('inside selection, would move');
          }
          else { // outside selection: drop selection and start a new one
            console.log('outside selection, starting new selection');
            this.props.signal.selectionStarted.dispatch(point);
          }


        }
        break;
    }

    this.setState({mousedown:true, last: event.timeStamp});
  },
  mouseup: function() {
    console.log('mouseup');

    switch(this.props.editor.tool) {
      case 'RectangularSelectionTool':
        //this.props.signal.selectionCleared.dispatch();
        var point = this.getWorldCoordinates(event);
        this.props.signal.selectionEnded.dispatch(point);
        break;
    }

    this.setState({mousedown:false});
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