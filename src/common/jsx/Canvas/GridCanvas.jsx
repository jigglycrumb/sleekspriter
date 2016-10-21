var GridCanvas = React.createClass({
  mixins: [StageBoxCanvasMixin],
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    columns: React.PropTypes.number,
    rows: React.PropTypes.number,
  },
  render: function() {
    var css = {
      width: this.props.width,
      height: this.props.height,
    }

    return (
      <canvas className="GridCanvas" style={css} width={this.props.width} height={this.props.height}></canvas>
    );
  },
  componentDidMount: function() {
    this.drawGrid();
  },
  componentDidUpdate: function() {
    this.clear();
    this.drawGrid();
  },
  drawGrid: function() {
    var canvas = ReactDOM.findDOMNode(this),
        ctx = canvas.getContext('2d'),
        cell = {
          width: this.props.width/this.props.columns,
          height: this.props.height/this.props.rows
        };

    ctx.strokeStyle = "#828282";
    ctx.beginPath();

    if(this.props.columns > 1) {
      // vertical lines
      for(var x = cell.width+0.5; x < this.props.width; x+= cell.width) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
    }

    if(this.props.rows > 1) {
      // horizontal lines
      for(var y = cell.height+0.5; y < this.props.height; y+= cell.height) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
    }

    ctx.stroke();
  },
});
