var ScreenExport = React.createClass({
  // mixins: [PostalSubscriptionMixin],
  // getInitialState: function() {
  //   return {
  //     part: 'spritesheet',
  //     frame: 1,
  //     animation: null,
  //     zoom: 1,
  //     format: 'png',
  //     subscriptions: {
  //       'export.part.set': this.updateSettings,
  //       'export.frame.set': this.updateSettings,
  //       'export.animation.set': this.updateSettings,
  //       'export.zoom.set': this.updateSettings,
  //       'export.format.set': this.updateSettings,
  //       'file.load': this.updateSettings,
  //     },
  //   }
  // },
  componentWillReceiveProps: function(nextProps) {
    // if(nextProps.ui.frames.total === 1) this.setState({part: 'spritesheet'});
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
          <ExportPreviewBox ui={this.props.ui} file={this.props.file} />
        </div>

        <div className="area statusbar">
          <ExportStatus ui={this.props.ui} />
        </div>
      </section>
    )
  },
  componentDidUpdate: function() {
    if(this.props.ui.export.animation === null && this.props.file.animations.length > 0) {
      // this.setState({animation: this.props.file.animations[0].id});
    }
  },
  // updateSettings: function(data) {
  //   this.setState(data);
  // },
});