var ScreenExport = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      part: 'spritesheet',
      frame: 1,
      animation: null,
      zoom: 1,
      format: 'png',
      subscriptions: {
        'export.part.set': this.updateSettings,
        'export.frame.set': this.updateSettings,
        'export.animation.set': this.updateSettings,
        'export.zoom.set': this.updateSettings,
        'export.format.set': this.updateSettings,
        'file.load': this.updateSettings,
      },
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if(nextProps.ui.frames.total === 1) this.setState({part: 'spritesheet'});
  },
  render: function() {

    var partSelection = this.props.ui.frames.total === 1
                      ? null
                      : <ExportPartSelection ui={this.props.ui} file={this.props.file} part={this.state.part} frame={this.state.frame} animation={this.state.animation} />;

    return (
      <section className="screen export">
        <div className="area left">
          <h5>Settings</h5>
          {partSelection}
          <ExportZoomSelection zoom={this.state.zoom} part={this.state.part} ui={this.props.ui} file={this.props.file} />
          <ExportOutputSelection format={this.state.format} part={this.state.part} />
          <ExportButton ui={this.props.ui} format={this.state.format} part={this.state.part} frame={this.state.frame} animation={this.state.animation} />
        </div>

        <div className="area right">
          <ExportPreviewBox 
            part={this.state.part}
            frame={this.state.frame}
            animation={this.state.animation}
            zoom={this.state.zoom} 
            format={this.state.format}
            dimensions={this.props.file.size}
            frames={this.props.file.frames}
            ui={this.props.ui}
            file={this.props.file} />
        </div>

        <div className="area statusbar">
          <ExportStatus />
        </div>
      </section>
    )
  },
  componentDidUpdate: function() {
    if(this.state.animation === null && this.props.file.animations.length > 0) {
      this.setState({animation: this.props.file.animations[0].name});
    }
  },
  updateSettings: function(data) {
    this.setState(data);
  },
});