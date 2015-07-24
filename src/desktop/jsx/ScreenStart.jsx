var ScreenStart = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    return (
      <section className="screen start" onDrop={this.handleDrop}>
        <div className="splash">
          <div className="inner">
            <div className="logo">@@name</div>
            <ul>
              <li><a onClick={this.newFile}>New file</a></li>
              <li><a onClick={this.openFile}>Open file</a></li>
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