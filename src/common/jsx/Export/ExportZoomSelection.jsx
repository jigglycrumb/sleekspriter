var ExportZoomSelection = React.createClass({
  render: function() {

    var width = 0,
        height = 0;

    switch(this.props.part) {
      case 'spritesheet':
        width = this.props.editor.file.size.width * this.props.editor.frames.x * this.props.zoom;
        height = this.props.editor.file.size.height * this.props.editor.frames.y * this.props.zoom;
        break;

      default:
        width = this.props.editor.file.size.width * this.props.zoom;
        height = this.props.editor.file.size.height * this.props.zoom;
        break;
    }

    return (
      <div>
        <h6>Size</h6>
        <ul>
          <li>
            <input type="range" min={this.props.editor.zoom.min} max={this.props.editor.zoom.max} value={this.props.zoom} onChange={this.setSize} />
            <input type="number" min={this.props.editor.zoom.min} max={this.props.editor.zoom.max} value={this.props.zoom} onChange={this.setSize} />
          </li>
          <li>
            <i>Exported image size: {width}x{height} pixels</i>
          </li>
        </ul>
      </div>
    )
  },
  setSize: function(event) {
    var size = +event.target.value;
    if(size > 50) size = 50;
    if(size < 1) size = 1;
    channel.publish('export.zoom.set', {zoom: size});
  },
});