var ScreenHelper = React.createClass({
  shouldComponentUpdate: function() {
    switch(stateHistory.last.action) {
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
      case 'EXPORT_PART':
      case 'EXPORT_FRAME':
      case 'EXPORT_ANIMATION':
      case 'EXPORT_ZOOM':
      case 'EXPORT_FORMAT':
      case 'EXPORT_STATUS':
        return false;

      default:
        return true;
    }
  },
  render: function() {
    return (
      <section className="screen helper">
        <div className="area top">
          <h1>Helpers</h1>
        </div>

        <div className="area center">
          <SelectionPattern />
          <div id="LayerHelper"><LayerCanvas zoom={1} layer={this.props.ui.layers.selected} file={this.props.file} pixels={this.props.pixels} /></div>
          <div id="FrameHelper"><FrameCanvas zoom={1} frame={this.props.ui.frames.selected} file={this.props.file} pixels={this.props.pixels} noAlpha={true} /></div>
        </div>
      </section>
    );
  },
});
