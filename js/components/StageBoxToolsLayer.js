var StageBoxToolsLayer = React.createClass({
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
    this.getDOMNode().addEventListener('mousemove', this.dispatchpixelSelected);
  },
  componentDidUpdate: function() {

    this.getDOMNode().width = this.getDOMNode().width;

    if(this.props.editor.grid === true) {
      this.drawGrid();
    }

    switch(this.props.editor.tool) {
      case 'BrushTool':
        this.drawPixelCursor();
        if(this.state.mousedown) {
          var layer = io.getLayerById(this.props.editor.layer);
          if(!layer.visible || layer.opacity == 0) alert('You are trying to paint on an invisible layer. Please make the layer visible and try again.');
          else pixel.fill();
        }
        break;
      case 'EraserTool':
        this.drawPixelCursor();
        if(this.state.mousedown) {
          var layer = io.getLayerById(this.props.editor.layer);
          if(!layer.visible || layer.opacity == 0) alert('You are trying to erase on an invisible layer. Please make the layer visible and try again.');
          else pixel.clear();
        }
        break;
    }
  },
  getInitialState: function() {
    return {
      mousedown: false
    };
  },
  dispatchpixelSelected: function(event) {
    switch(this.props.editor.tool) {
      case 'BrushTool':
      case 'EraserTool':
        var world_x = Math.ceil(event.layerX/this.props.editor.zoom),
            world_y = Math.ceil(event.layerY/this.props.editor.zoom);
        this.props.signal.pixelSelected.dispatch(world_x, world_y);
        break;
    }
  },
  mousedown: function(event) {
    this.setState({mousedown:true});
    this.dispatchpixelSelected(event);
  },
  mouseup: function() {
    this.setState({mousedown:false});
  },
  mouseleave: function() {
    this.props.signal.pixelSelected.dispatch(0, 0);
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
        zoom = this.props.editor.zoom; //,
       // grid = this.props.editor.grid;

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