var ScreenExport = React.createClass({
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