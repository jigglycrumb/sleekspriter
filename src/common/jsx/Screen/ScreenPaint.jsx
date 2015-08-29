var ScreenPaint = React.createClass({
  getInitialState: function() {
    return {
      referenceImage: null,
    }
  },

  render: function() {
    var settingsBoxStyle = {
          display: this.props.ui.settings.paint === true ? 'block' : 'none',
        };

    var frameBox = null;
    if(this.props.ui.frames.total > 1) frameBox = <FrameBox file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} fold="frames" />

    var referenceImage = null;
    if(this.state.referenceImage !== null) referenceImage = <ReferenceImage image={this.state.referenceImage} removeHandler={this.resetImage} />

    return (
      <section className="screen paint">
        <div className="area top">
          <ToolContainer ui={this.props.ui} file={this.props.file} />
        </div>
        <div className="area left">
          <ToolBox ui={this.props.ui} />
        </div>
        <div className="area center" onDrop={this.handleDrop}>
          <StageBox image={this.state.referenceImage} file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} />
          {referenceImage}
        </div>
        <div className="area right">
          <div id="layerboxhelper">
            <PreviewBox file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} fold="preview" />
            {frameBox}
          </div>
          <LayerBox file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} fold="layers" />
        </div>
        <div className="area statusbar">
          <StatusBar ui={this.props.ui} />
        </div>
        <div className="area settings" style={settingsBoxStyle}>
          <SettingsBox ui={this.props.ui} />
        </div>
      </section>
    )
  },

  handleDrop: function(e) {
    e.preventDefault();
    if(e.dataTransfer.files.length >= 1) {
      var file = e.dataTransfer.files[0],
          allowed = {
            'image/jpeg': true,
            'image/gif': true,
            'image/png': true,
          };

      if(file.type in allowed) {
        this.setState({referenceImage: file});
      }
    }
  },

  resetImage: function() {
    this.setState({referenceImage: null});
  },
});