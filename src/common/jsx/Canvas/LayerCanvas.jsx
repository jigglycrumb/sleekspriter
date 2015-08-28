var LayerCanvas = React.createClass({
  propTypes: {
    layer: React.PropTypes.number.isRequired, // layer id
    zoom: React.PropTypes.number.isRequired, // zoom level
    file: React.PropTypes.object.isRequired, // FileStore
    pixels: React.PropTypes.object.isRequired, // PixelStore
  },
  render: function() {
    return (
      <canvas style={{border: '1px solid red'}}></canvas>
    );
  },
});