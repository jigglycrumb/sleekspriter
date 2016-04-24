var ScreenExport = React.createClass({
  shouldComponentUpdate: function() {
    switch(stateHistory.last.action) {
      case 'CURSOR_SET':
      case 'TOOL_SELECT':
      case 'SETTINGS_GRID':
      case 'ZOOM_SELECT':
      case 'FRAME_SELECT':
      case 'BRIGHTNESSTOOL_MODE':
      case 'BRIGHTNESSTOOL_INTENSITY':
      case 'COLOR_BRUSH':
      case 'PALETTE_SELECT':
      case 'LAYER_SELECT':
      case 'LAYER_TOP_SELECT':
      case 'BOX_FOLD':
      case 'BOX_PREVIEW_TOGGLE':
      case 'ONION_TOGGLE':
      case 'ONION_MODE':
      case 'ONION_FRAME':
      case 'SELECTION_START':
      case 'SELECTION_RESIZE':
      case 'SELECTION_PREVIEW':
      case 'SELECTION_END':
      case 'SELECTION_CLEAR':
        return false;

      default:
        return true;
    }
  },
  render: function() {

    var partSelection = this.props.ui.frames.total === 1
                      ? null
                      : <ExportPartSelection ui={this.props.ui} file={this.props.file} />;

    return (
      <section className="screen export">
        <div className="area left">
          <h5>Settings</h5>
          {partSelection}
          <ExportZoomSelection ui={this.props.ui} file={this.props.file} />
          <ExportOutputSelection ui={this.props.ui} />
          <ExportButton ui={this.props.ui} file={this.props.file} />
        </div>

        <div className="area right">
          <ExportPreviewBox ui={this.props.ui} file={this.props.file} pixels={this.props.pixels} />
        </div>

        <div className="area statusbar">
          <ExportStatus ui={this.props.ui} />
        </div>
      </section>
    )
  },
});
