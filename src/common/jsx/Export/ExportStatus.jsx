// Flux: done, editor: done
var ExportStatus = React.createClass({
  mixins: [FluxMixin],
  getInitialState: function() {
    return {
      timer: null
    }
  },
  render: function() {
    return (
      <div className="bar" ref="bar">{this.props.ui.export.status}</div>
    )
  },
  componentDidUpdate: function() {
    if(this.state.timer === null && this.props.ui.export.status.length > 0) {
      var timer = setTimeout(this.clearStatus, 5000);
      this.setState({timer: timer});
    }
  },
  clearStatus: function() {
    this.setState({timer: null});
    this.getFlux().actions.exportStatus('');
  },
});