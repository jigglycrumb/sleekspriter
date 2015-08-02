// Flux: done, editor: done
var ExportZoomSelection = React.createClass({
  mixins: [FluxMixin],
  render: function() {

    var text;

    switch(this.props.ui.export.part) {
      case 'spritesheet':
        text = <i>
                Frame size: {this.props.file.size.width * this.props.ui.export.zoom}x{this.props.file.size.height * this.props.ui.export.zoom} pixels<br/>
                Spritesheet size: {this.props.file.size.width * this.props.file.frames.x * this.props.ui.export.zoom}x{this.props.file.size.height * this.props.file.frames.y * this.props.ui.export.zoom} pixels
               </i>
        break;

      default:
        text = <i>
                Image size: {this.props.file.size.width * this.props.ui.export.zoom}x{this.props.file.size.height * this.props.ui.export.zoom} pixels
               </i>
        break;
    }

    return (
      <div>
        <h6>Zoom</h6>
        <ul>
          <li>
            <input type="range" min={this.props.ui.zoom.min} max={this.props.ui.zoom.max} value={this.props.ui.export.zoom} onChange={this.setZoom} />
            <input type="number" min={this.props.ui.zoom.min} max={this.props.ui.zoom.max} value={this.props.ui.export.zoom} onChange={this.setZoom} />
          </li>
          <li>
            {text}
          </li>
        </ul>
      </div>
    )
  },
  setZoom: function(event) {
    var zoom = +event.target.value;
    if(zoom > this.props.ui.zoom.max) zoom = this.props.ui.zoom.max;
    if(zoom < this.props.ui.zoom.min) zoom = this.props.ui.zoom.min;
    this.getFlux().actions.exportZoom(zoom);
  },
});