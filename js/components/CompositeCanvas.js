var CompositeCanvas = React.createClass({
  mixins: [CompositeCanvasMixin],
  render: function() {
    return (
      <canvas
        id="CompositeCanvas"
        width={this.props.io.size.width*this.props.editor.zoom}
        height={this.props.io.size.height*this.props.editor.zoom}
        style={{
          width: this.props.io.size.width,
          height: this.props.io.size.height
        }}
      ></canvas>
    );
  },
  componentDidMount: function() {
    this.props.signal.pixelSelected.add(this.getPixelColor);
  },
  getPixelColor: function(x, y) {
    var ctx = this.getDOMNode().getContext('2d'),
        px = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data,
        color = Color({r:px[0], g:px[1], b:px[2], a:px[3]});

    editor.pixelColor = color;
  }
});