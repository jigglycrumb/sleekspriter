var StatusBar = React.createClass({
  mixins: [FluxMixin, TouchMixin],
  render: function() {
    var toggleGridTitle = 'Toggle grid ('+hotkeys.actions.paint.toggleGrid.key+')',
        gridButtonClasses = classNames({
          tiny: true,
          transparent: true,
          active: this.props.ui.settings.grid,
        });

    var pixelCount = this.props.pixels.frame.length + this.props.pixels.scope.length || 0;

    return (
      <div className="bar">
        <span ref="cursorX">X: {this.props.ui.cursor.x}</span>
        <span ref="cursorY">Y: {this.props.ui.cursor.y}</span>
        <div id="StatusBarColor" style={{background: this.props.ui.color.frame.rgbaString()}}></div>
        <span id="StatusBarColorString">{this.props.ui.color.frame.alpha() === 0 ? 'transparent': this.props.ui.color.frame.hexString()}</span>
        <span>Frame {this.props.ui.frames.selected}, {pixelCount} pixels</span>
        &nbsp;
        <span>Zoom &times;{this.props.ui.zoom.selected}</span>
        <div id="StatusBarButtons">
          <button id="toggleGrid" className={gridButtonClasses} onClick={this.handleClick.bind(this, this.dispatchGridToggled)} onTouchStart={this.handleTouch.bind(this, this.dispatchGridToggled)} title={toggleGridTitle}>
            <i className="flaticon-3x3"></i>
          </button>
        </div>
      </div>
    );
  },
  dispatchGridToggled: function(event) {
    this.getFlux().actions.settingsGrid(!this.props.ui.settings.grid);
  },
  dispatchSettingsToggled: function(event) {
    this.getFlux().actions.settingsPaint(!this.props.ui.settings.paint);
  },
});
