var ExportSizeSelection = React.createClass({
  render: function() {

    var width = 0,
        height = 0;

    switch(this.props.part) {
      case 'spritesheet':
        width = this.props.dimensions.width * this.props.frames.x * this.props.size;
        height = this.props.dimensions.height * this.props.frames.y * this.props.size;
        break;

      default:
        width = this.props.dimensions.width * this.props.size;
        height = this.props.dimensions.height * this.props.size;
        break;
    }

    return (
      <div>
        <h6>Zoom</h6>
        <ul>
          <li>
            <input type="range" min={1} max={50} value={this.props.size} onChange={this.setSize} />
            <label>{this.props.size}</label>
          </li>
          <li>
            <i>File dimensions: {width}x{height} Pixels</i>
          </li>
        </ul>
      </div>
    )
  },
  setSize: function(event) {
    channel.publish('export.size.set', {size: +event.target.value});
  },
});