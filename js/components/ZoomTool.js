var ZoomTool = React.createClass({
  render: function() {

    var zoom = editor.zoom;
    return (
      <div id="Zoom-Tool" className="ToolComponent">
        <i className="icon-search"></i>
        <button onClick={this.zoomIn} className="small"><i className="fa fa-plus"></i></button>
        <button onClick={this.zoomOut} className="small"><i className="fa fa-minus"></i></button>
        <input type="range" min="1" max="50" className="zoom-slider" value={this.props.editor.zoom} onChange={this.dispatchZoomChanged} />
        <span>Zoom:</span>
        <input type="number" min="1" max="50" className="zoom-number" value={this.props.editor.zoom} onChange={this.dispatchZoomChanged} />
        <button onClick={this.fitToScreen} className="small">Fit to screen</button>
      </div>
    );
  },
  dispatchZoomChanged: function(event, zoom) {
    zoom = _.isNull(event) ? zoom : event.target.value;
    signal.zoomChanged.dispatch(zoom);
  },
  zoomIn: function() {
    if(editor.zoom+1 <= 50) this.dispatchZoomChanged(null, editor.zoom+1);
  },
  zoomOut: function() {
    if(editor.zoom-1 >= 1 ) this.dispatchZoomChanged(null, editor.zoom-1);
  },
  fitToScreen: function() {
    var top = 40,
        bottom = 20,
        left = 40,
        right = 200;

    var zoom = Math.floor((window.innerHeight - top - bottom)/io.size.height);
    if((io.size.width*zoom) > (window.innerWidth - left - right)) {
      zoom = Math.floor((window.innerWidth - left - right)/io.size.width);
    }

    this.dispatchZoomChanged(null, zoom);
  }
});