var StatusBar = React.createClass({
  render: function() {
    var toggleGridTitle = 'Toggle grid ('+hotkeys.actions.toggleGrid.key+')',
        settingsButtonClasses = React.addons.classSet({
          tiny: true,
          transparent: true,
          active: this.props.editor.settingsVisible,
        }),
        gridButtonClasses = React.addons.classSet({
          tiny: true,
          transparent: true,
          active: this.props.editor.grid.enabled,
        });

    return (
      <div id="StatusBar">
        <span>X: {this.props.editor.cursor.position.x}</span>
        <span>Y: {this.props.editor.cursor.position.y}</span>
        <div id="StatusBarColor" style={{background: this.props.editor.color.frame.rgbaString()}}></div>
        <span id="StatusBarColorString">{this.props.editor.color.frame.alpha() == 0 ? 'transparent': this.props.editor.color.frame.hexString()}</span>
        <span>Frame {this.props.editor.frame.selected}, {this.props.editor.pixels.frame.length + this.props.editor.pixels.scope.length} pixels</span>
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
    channel.publish('grid.toggle', {grid: !this.props.editor.grid.enabled});
  },
  dispatchSettingsToggled: function(event) {
    channel.publish('settings.toggle', {visible: !this.props.editor.settingsVisible});
  },
});