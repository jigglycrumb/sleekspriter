var ScreenExport = React.createClass({
  render: function() {
    return (
      <section className="screen export">
        <div className="area left">
          <h5>Settings</h5>

          <ExportPartSelection editor={this.props.editor} />
          <ExportSizeSelection />
          <ExportOutputSelection />

          <button>Export</button>

        </div>

        <div className="area right">
          <ExportPreviewBox editor={this.props.editor} />
        </div>

        <div className="area statusbar">
          <div className="bar"></div>
        </div>
      </section>
    )
  },
});