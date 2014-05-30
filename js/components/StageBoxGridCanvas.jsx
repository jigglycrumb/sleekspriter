/** @jsx React.DOM */
var StageBoxGridCanvas = React.createClass({
  mixins: [StageBoxCanvasMixin],
  render: function() {
    return (
      <canvas id="StageBoxGridCanvas" className="Layer" width={this.props.width} height={this.props.height} />
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