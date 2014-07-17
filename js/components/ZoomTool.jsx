/** @jsx React.DOM */
var ZoomTool = React.createClass({
  render: function() {

    var zoom = editor.zoom;
    return (
      <div id="Zoom-Tool" className="ToolComponent">
        <i className="icon flaticon-magnifier5"></i>
        <button onClick={this.zoomIn} className="small" title="Zoom in"><i className="flaticon-plus25"></i></button>
        <button onClick={this.zoomOut} className="small" title="Zoom out"><i className="flaticon-minus18"></i></button>
        <input type="range" min="1" max="50" className="zoom-slider" value={this.props.editor.zoom} onChange={this.dispatchZoomChanged} />
        <span>Zoom &times;</span>
        <input type="number" min="1" max="50" className="zoom-number" value={this.props.editor.zoom} onChange={this.dispatchZoomChanged} />
        <button onClick={this.fitToScreen} className="small">Fit to screen</button>
        <span className="spacer"></span>
        <span className="hint">A pixel in your sprite is now {this.props.editor.zoom} pixels on your screen.</span>
      </div>
    );
  },
  dispatchZoomChanged: function(event, zoom) {
    zoom = _.isNull(event) ? zoom : event.target.value;
    channel.publish('stage.zoom.select', {zoom: zoom});
  },
  zoomIn: function() {
    if(this.props.editor.zoom+1 <= 50) this.dispatchZoomChanged(null, this.props.editor.zoom+1);
  },
  zoomOut: function() {
    if(this.props.editor.zoom-1 >= 1 ) this.dispatchZoomChanged(null, this.props.editor.zoom-1);
  },
  fitToScreen: function() {
    var zoom = Math.floor((window.innerHeight - this.props.editor.offset.top - this.props.editor.offset.bottom)/this.props.editor.file.size.height);
    if((this.props.editor.file.size.width*zoom) > (window.innerWidth - this.props.editor.offset.left - this.props.editor.offset.right)) {
      zoom = Math.floor((window.innerWidth - this.props.editor.offset.left - this.props.editor.offset.right)/this.props.editor.file.size.width);
    }
    this.dispatchZoomChanged(null, zoom);
  }
});