var ExportButton = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    return (
      <a className="button" ref="theButton" onClick={this.export}>Export</a>
    )
  },
  export: function() {
    platformUtils.exportFile(this.props);
  },
});