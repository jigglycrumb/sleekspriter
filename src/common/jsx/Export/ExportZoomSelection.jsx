var ExportZoomSelection = React.createClass({
  render: function() {

    var text;

    switch(this.props.part) {
      case 'spritesheet':
        text = <i>
                Frame size: {this.props.editor.file.size.width * this.props.zoom}x{this.props.editor.file.size.height * this.props.zoom} pixels<br/>
                Spritesheet size: {this.props.editor.file.size.width * this.props.editor.frames.x * this.props.zoom}x{this.props.editor.file.size.height * this.props.editor.frames.y * this.props.zoom} pixels
               </i>
        break;

      default:
        text = <i>
                Image size: {this.props.editor.file.size.width * this.props.zoom}x{this.props.editor.file.size.height * this.props.zoom} pixels
               </i>
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
            {text}
          </li>
        </ul>
      </div>
    )
  },
  setSize: function(event) {
    var size = +event.target.value;
    if(size > 50) size = 50;
    if(size < 1) size = 1;
    channel.gui.publish('export.zoom.set', {zoom: size});
  },
});