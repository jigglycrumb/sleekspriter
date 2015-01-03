var ScreenExport = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      part: 'spritesheet',
      frame: 1,
      animation: null,
      size: 1,
      format: 'png',
      subscriptions: {
        'export.part.set': this.updateSettings,
        'export.frame.set': this.updateSettings,
        'export.animation.set': this.updateSettings,
        'export.size.set': this.updateSettings,
        'export.format.set': this.updateSettings,
      },
    }
  },
  render: function() {
    return (
      <section className="screen export">
        <div className="area left">
          <h5>Settings</h5>

          <ExportPartSelection editor={this.props.editor} part={this.state.part} frame={this.state.frame} />
          <ExportSizeSelection size={this.state.size} part={this.state.part} dimensions={this.props.editor.file.size} frames={this.props.editor.frames} />
          <ExportOutputSelection format={this.state.format} part={this.state.part} />

          <button>Export</button>

        </div>

        <div className="area right">
          <ExportPreviewBox part={this.state.part} frame={this.state.frame} editor={this.props.editor} />
        </div>

        <div className="area statusbar">
          <div className="bar"></div>
        </div>
      </section>
    )
  },
  updateSettings: function(data) {
    this.setState(data);
  },
});