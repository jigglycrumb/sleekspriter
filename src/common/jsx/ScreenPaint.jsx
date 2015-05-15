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
    var frames = [],
        settingsBoxStyle = {
          display: this.props.editor.settingsVisible === true ? 'block' : 'none',
        };

    for(var i=0; i < this.props.editor.frames.total; i++) frames[i] = i+1;

    var frameBox = null;
    if(this.props.editor.frames.total > 1) frameBox = <FrameBox editor={this.props.editor} workspace={this.props.workspace} fold="frames" />

    return (
      <section className="screen paint">
        <div className="area top">
          <ToolContainer editor={this.props.editor} />
        </div>
        <div className="area left">
          <ToolBox editor={this.props.editor} />
        </div>
        <div className="area center" onDrop={this.handleDrop}>
          <StageBox editor={this.props.editor} image={this.state.referenceImage} />
          <ReferenceImage image={this.state.referenceImage} />
        </div>
        <div className="area right">
          <div id="layerboxhelper">
            <PreviewBox editor={this.props.editor} workspace={this.props.workspace} fold="preview" />
            {frameBox}
          </div>
          <LayerBox editor={this.props.editor} workspace={this.props.workspace} fold="layers" />
        </div>
        <div className="area statusbar">
          <StatusBar editor={this.props.editor} />
        </div>
        <div className="area settings" style={settingsBoxStyle}>
          <SettingsBox editor={this.props.editor} />
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

        this.setState({ referenceImage: ref });
      }
    }
  },

  resetImage: function() {
    this.setState({ referenceImage: { file: null }});
  },
});