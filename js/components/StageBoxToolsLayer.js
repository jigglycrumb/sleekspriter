var StageBoxToolsLayer = React.createClass({
  getInitialState: function() {
    return {
      mousedown: false,
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
            var alpha = editor.layerPixelColor.alpha();
            if(alpha > 0) {
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

    var world_x = Math.ceil(event.layerX/this.props.editor.zoom),
        world_y = Math.ceil(event.layerY/this.props.editor.zoom);

    this.props.signal.pixelSelected.dispatch(world_x, world_y);
  },
  mousedown: function(event) {
    this.setState({mousedown:true});
    this.dispatchPixelSelected(event);
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

    //console.log('getting layer pixel color', x, y, this.props.editor.layerPixelColor.hexString());
  },
  drawPixelCursor: function() {

    var zoom = this.props.editor.zoom,
        x = this.props.editor.pixel.x,
        y = this.props.editor.pixel.y;

    //console.log('drawing cursor', x, y, zoom);

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