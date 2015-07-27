var ScreenPaint = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      referenceImage: {
        file: null,
      },
      subscriptions: {
        'referenceimage.remove': this.resetImage,
      }
    }
  },

  render: function() {
    var settingsBoxStyle = {
          display: this.props.ui.settings.paint === true ? 'block' : 'none',
        };

    var frameBox = null;
    if(this.props.ui.frames.total > 1) frameBox = <FrameBox file={this.props.file} ui={this.props.ui} fold="frames" />

    return (
      <section className="screen paint">
        <div className="area top">
          <ToolContainer ui={this.props.ui} file={this.props.file} editor={this.props.editor} />
        </div>
        <div className="area left">
          <ToolBox ui={this.props.ui} />
        </div>
        <div className="area center" onDrop={this.handleDrop}>
          <StageBox editor={this.props.editor} image={this.state.referenceImage} file={this.props.file} ui={this.props.ui} />
          <ReferenceImage image={this.state.referenceImage} />
        </div>
        <div className="area right">
          <div id="layerboxhelper">
            <PreviewBox editor={this.props.editor} fold="preview" />
            {frameBox}
          </div>
          <LayerBox editor={this.props.editor} fold="layers" />
        </div>
        <div className="area statusbar">
          <StatusBar editor={this.props.editor} ui={this.props.ui} />
        </div>
        <div className="area settings" style={settingsBoxStyle}>
          <SettingsBox editor={this.props.editor} ui={this.props.ui} />
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
        var ref = {
          file: file,
        };

        this.setState({referenceImage: ref});
      }
    }
  },

  resetImage: function() {
    this.setState({referenceImage: {file: null}});
  },
});