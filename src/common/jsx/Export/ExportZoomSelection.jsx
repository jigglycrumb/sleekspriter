var ExportZoomSelection = React.createClass({
  render: function() {

    var text;

    switch(this.props.part) {
      case 'spritesheet':
        text = <i>
                Frame size: {this.props.file.size.width * this.props.zoom}x{this.props.file.size.height * this.props.zoom} pixels<br/>
                Spritesheet size: {this.props.file.size.width * this.props.file.frames.x * this.props.zoom}x{this.props.file.size.height * this.props.file.frames.y * this.props.zoom} pixels
               </i>
        break;

      default:
        text = <i>
                Image size: {this.props.file.size.width * this.props.zoom}x{this.props.file.size.height * this.props.zoom} pixels
               </i>
        break;
    }

    return (
      <div>
        <h6>Size</h6>
        <ul>
          <li>
            <input type="range" min={this.props.ui.zoom.min} max={this.props.ui.zoom.max} value={this.props.zoom} onChange={this.setSize} />
            <input type="number" min={this.props.ui.zoom.min} max={this.props.ui.zoom.max} value={this.props.zoom} onChange={this.setSize} />
          </li>
          <li>
            {text}
          </li>
        </ul>
      </div>
    )
  },
  setSize: function(event) {
    var size = +event.target.value;
    if(size > this.props.ui.zoom.max) size = this.props.ui.zoom.max;
    if(size < this.props.ui.zoom.min) size = this.props.ui.zoom.min;
    channel.gui.publish('export.zoom.set', {zoom: size});
  },
});