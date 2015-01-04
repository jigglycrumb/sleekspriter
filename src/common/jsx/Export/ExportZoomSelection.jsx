var ExportZoomSelection = React.createClass({
  render: function() {

    var width = 0,
        height = 0;

    switch(this.props.part) {
      case 'spritesheet':
        width = this.props.dimensions.width * this.props.frames.x * this.props.zoom;
        height = this.props.dimensions.height * this.props.frames.y * this.props.zoom;
        break;

      default:
        width = this.props.dimensions.width * this.props.zoom;
        height = this.props.dimensions.height * this.props.zoom;
        break;
    }

    return (
      <div>
        <h6>Zoom</h6>
        <ul>
          <li>
            <input type="range" min={1} max={50} value={this.props.zoom} onChange={this.setSize} />
            &nbsp;<label>x{this.props.zoom}</label>
          </li>
          <li>
            <i>File dimensions: {width}x{height} Pixels</i>
          </li>
        </ul>
      </div>
    )
  },
  setSize: function(event) {
    channel.publish('export.zoom.set', {zoom: +event.target.value});
  },
});