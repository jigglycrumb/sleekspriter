var DebugLog = React.createClass({
  mixins: [TouchMixin],
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
        <button onClick={this.handleClick.bind(this, this.clearLog)} onTouchStart={this.handleTouch.bind(this, this.clearLog)}>Clear log</button>
        <textarea ref="log" readOnly></textarea>
      </div>
    )
  },
  toggle: function(event) {
    var enabled = event.target.value === 'on' ? true : false;
    if(enabled) {
      flux.on('dispatch', this.log);
    }
    else {
      flux.removeListener('dispatch', this.log);
    }
    this.setState({enabled: enabled});
  },
  clearLog: function() {
    this.refs.log.innerHTML = '';
  },
  componentWillUnmount: function() {
    flux.removeListener('dispatch', this.log);
  },
  log: function(type, payload) {
    var log = this.refs.log,
        logLine = "[Dispatch] "+type+" "+JSON.stringify(payload, 2)+"\n",
        logText = log.innerHTML || "";

    log.innerHTML = logText + logLine;
  },
});
