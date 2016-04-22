var DebugLog = React.createClass({
  getInitialState: function() {
    return {enabled: false}
  },
  render: function() {
    return (
      <div id="DebugLog">
        <label>
          <input type="checkbox" onChange={this.toggle} />
          Logging enabled
        </label>
        <button onClick={this.clearLog}>Clear log</button>
        <textarea ref="log" readOnly></textarea>
      </div>
    )
  },
  toggle: function(event) {
    var enabled = event.target.value === 'on' ? true : false;
    this.setState({enabled: enabled});
  },
  clearLog: function() {
    this.refs.log.innerHTML = '';
  },
  componentDidMount: function() {
    flux.on('dispatch', this.log);
  },
  componentWillUnmount: function() {
    flux.removeListener('dispatch', this.log);
  },
  log: function(type, payload) {
    if(this.state.enabled === true) {
      var log = this.refs.log,
          logLine = "[Dispatch] "+type+" "+JSON.stringify(payload, 2)+"\n",
          logText = log.innerHTML || "";

      log.innerHTML = logText + logLine;
    }
  },
});
