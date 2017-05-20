var ExportButton = React.createClass({
  mixins: [FluxMixin, TouchMixin],
  render: function() {
    return (
      <a className="button" ref="theButton" onClick={this.handleClick.bind(this, this.export)} onTouchStart={this.handleTouch.bind(this, this.export)}>Export</a>
    )
  },
  export: function() {
    platformUtils.exportFile(this.props);
  },
});
