/** @jsx React.DOM */
var StatusBar = React.createClass({
  render: function() {
    var cssClasses = (this.props.editor.grid === true ? 'active' : '') + ' tiny transparent',
        toggleGridTitle = 'Toggle grid ('+hotkeys.actions.toggleGrid.key+')';

    return (
      <div id="StatusBar">
        <span>X: {this.props.editor.pixel.x}</span>
        <span>Y: {this.props.editor.pixel.y}</span>
        <div id="StatusBarColor" style={{background: this.props.editor.pixelColor.rgbaString()}}></div>
        <span id="StatusBarColorString">{this.props.editor.pixelColor.alpha() == 0 ? 'transparent': this.props.editor.pixelColor.hexString()}</span>
        <span>Frame {this.props.editor.frame}, {this.props.editor.pixels.frame.length + this.props.editor.selection.pixels.length} pixels</span>
        &nbsp;
        <span>Zoom &times;{this.props.editor.zoom}</span>
        <div id="StatusBarButtons">
          <button id="toggleGrid" className={cssClasses} onClick={this.dispatchGridToggled} title={toggleGridTitle}>
            <i className="flaticon-3x3"></i>
          </button>
        </div>
      </div>
    );
  },
  dispatchGridToggled: function(event) {
    channel.publish('stage.grid.toggle', {grid: !this.props.editor.grid});
  }
});