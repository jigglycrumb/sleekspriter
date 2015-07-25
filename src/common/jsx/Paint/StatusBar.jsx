var StatusBar = React.createClass({
  mixins: [FluxMixin, PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      cursor: {
        x: 1,
        y: 1,
      },
      subscriptions: {
        'cursor.set': this.updateCursorPosition,
      }
    }
  },
  render: function() {
    var toggleGridTitle = 'Toggle grid ('+hotkeys.actions.toggleGrid.key+')',
        settingsButtonClasses = classNames({
          tiny: true,
          transparent: true,
          active: this.props.ui.settings.paint,
        }),
        gridButtonClasses = classNames({
          tiny: true,
          transparent: true,
          active: this.props.ui.settings.grid,
        });

    return (
      <div className="bar">
        <span ref="cursorX">X: {this.state.cursor.x}</span>
        <span ref="cursorY">Y: {this.state.cursor.y}</span>
        <div id="StatusBarColor" style={{background: this.props.editor.color.frame.rgbaString()}}></div>
        <span id="StatusBarColorString">{this.props.editor.color.frame.alpha() == 0 ? 'transparent': this.props.editor.color.frame.hexString()}</span>
        <span>Frame {this.props.editor.frames.selected}, {this.props.editor.pixels.frame.length + this.props.editor.pixels.scope.length} pixels</span>
        &nbsp;
        <span>Zoom &times;{this.props.editor.zoom.current}</span>
        <div id="StatusBarButtons">
          <button id="toggleGrid" className={gridButtonClasses} onClick={this.dispatchGridToggled} title={toggleGridTitle}>
            <i className="flaticon-3x3"></i>
          </button>
          <button id="fileSettings" className={settingsButtonClasses} onClick={this.dispatchSettingsToggled} title="Stage Settings">
            <i className="flaticon-settings21"></i>
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
  updateCursorPosition: function(data, envelope) {
    this.setState({cursor: data.position});
  },
});