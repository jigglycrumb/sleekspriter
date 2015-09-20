var ZoomTool = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    return (
      <div id="Zoom-Tool" className="ToolComponent">
        <i className="icon flaticon-magnifier5"></i>
        <button onClick={this.zoomIn} className="small" title="Zoom in"><i className="flaticon-plus25"></i></button>
        <button onClick={this.zoomOut} className="small" title="Zoom out"><i className="flaticon-minus18"></i></button>
        <input type="range" min={this.props.ui.zoom.min} max={this.props.ui.zoom.max} value={this.props.ui.zoom.selected} onChange={this.dispatchZoomChanged} />
        <span>Zoom &times;</span>
        <input type="number" min={this.props.ui.zoom.min} max={this.props.ui.zoom.max} value={this.props.ui.zoom.selected} onChange={this.dispatchZoomChanged} />
        <button onClick={this.fitToScreen} className="small">Fit to screen</button>
        <span className="spacer"></span>
        <span className="hint">A pixel in your sprite is now {this.props.ui.zoom.selected} pixels on your screen.</span>
      </div>
    );
  },
  dispatchZoomChanged: function(event, zoom) {
    zoom = _.isNull(event) ? zoom : event.target.value;
    this.getFlux().actions.zoomSelect(zoom);
  },
  zoomIn: function() {
    if(this.props.ui.zoom.selected+1 <= this.props.ui.zoom.max) this.dispatchZoomChanged(null, this.props.ui.zoom.selected+1);
  },
  zoomOut: function() {
    if(this.props.ui.zoom.selected-1 >= this.props.ui.zoom.min) this.dispatchZoomChanged(null, this.props.ui.zoom.selected-1);
  },
  fitToScreen: function() {
    var zoom = Math.floor((window.innerHeight - this.props.ui.offset.top - this.props.ui.offset.bottom)/this.props.file.size.height);
    if((this.props.file.size.width*zoom) > (window.innerWidth - this.props.ui.offset.left - this.props.ui.offset.right)) {
      zoom = Math.floor((window.innerWidth - this.props.ui.offset.left - this.props.ui.offset.right)/this.props.file.size.width);
    }
    this.dispatchZoomChanged(null, zoom);
  }
});