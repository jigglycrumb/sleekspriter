var StatusBar = React.createClass({
  mixins: [FluxMixin, TouchMixin],
  render: function() {
    var toggleGridTitle = 'Toggle grid ('+hotkeys.actions.paint.toggleGrid.key+')',
        gridButtonClasses = classNames({
          tiny: true,
          transparent: true,
          active: this.props.ui.settings.grid,
        }),
        historyButtonClasses = classNames({
          tiny: true,
        }),
        undoDisabled = stateHistory.undoPointer <= 0 && stateHistory.last.pixels.length > 0 ? true : false,
        redoDisabled = stateHistory.undoPointer >= stateHistory.last.pixels.length - 1 ? true : false;

    var pixelCount = this.props.pixels.frame.length + this.props.pixels.scope.length || 0;

    return (
      <div className="bar">
        <span id="StatusBarCursorX">X: 0</span>
        <span id="StatusBarCursorY">Y: 0</span>
        <div id="StatusBarColor" style={{background: 'transparent'}}></div>
        <span id="StatusBarColorString">transparent</span>
        <span>Frame {this.props.ui.frames.selected}, {pixelCount} pixels</span>
        &nbsp;
        <span>Zoom &times;{this.props.ui.zoom.selected}</span>
        <div id="StatusBarButtons">
          <button id="historyUndo" className={historyButtonClasses} disabled={undoDisabled} onClick={this.handleClick.bind(this, this.dispatchHistoryUndo)} onTouchStart={this.handleTouch.bind(this, this.dispatchHistoryUndo)}>
            <i className="flaticon-back-arrow"></i>
          </button>
          <button id="historyRedo" className={historyButtonClasses} disabled={redoDisabled} onClick={this.handleClick.bind(this, this.dispatchHistoryRedo)} onTouchStart={this.handleTouch.bind(this, this.dispatchHistoryRedo)}>
            <i className="flaticon-arrow"></i>
          </button>

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
  dispatchHistoryUndo: function() {
    stateHistory.undo();
  },
  dispatchHistoryRedo: function() {
    stateHistory.redo();
  },
});
