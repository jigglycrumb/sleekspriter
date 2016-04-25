var ScreenStart = React.createClass({
  mixins: [FluxMixin, TouchMixin],
  render: function() {
    return (
      <section className="screen start" onDrop={this.handleDrop}>
        <div className="splash">
          <div className="inner">
            <div className="logo">@@name</div>
            <ul>
              <li><a onClick={this.handleClick.bind(this, this.newFile)} onTouchStart={this.handleTouch.bind(this, this.newFile)}>New file</a></li>
              <li><a onClick={this.handleClick.bind(this, this.openFile)} onTouchStart={this.handleTouch.bind(this, this.openFile)}>Open file</a></li>
            </ul>
          </div>
        </div>
        <div className="area statusbar">
          <div className="bar">
            Tip: Drop .pixels files on this screen to open them directly.
          </div>
        </div>
      </section>
    )
  },
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
  newFile: function() {
    this.getFlux().actions.tabSelect('paint');
    this.getFlux().actions.modalShow(ModalNewFile);
  },
  openFile: function() {
    platformUtils.showOpenFileDialog();
  },
  handleDrop: function(e) {
    e.preventDefault();
    if(e.dataTransfer.files.length >= 1) {
      var name = e.dataTransfer.files[0].name,
          suffix = name.substr(name.lastIndexOf('.')+1);

      if(suffix === 'pixels') platformUtils.loadFile(e.dataTransfer.files[0].path);
      else alert('Error: Could not read file format');
    }
  },
});
