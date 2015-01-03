var DebugLog = React.createClass({
  getInitialState: function() {
    return {
      wiretap: null,
    }
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
    var active = event.target.value === 'on' ? true : false;
    this.state.wiretap.active = active;
  },
  clearLog: function() {
    this.refs.log.getDOMNode().innerHTML = '';
  },
  componentDidMount: function() {
    var log = this.refs.log.getDOMNode(),
        active = this.state.active,
        wiretap = new postal.diagnostics.DiagnosticsWireTap({
          name: 'debuglog',
          active: active,
          filters: [
            { channel: "@@app" },
          ],
          writer: function(data) {
            var logText = log.innerHTML;
            if(logText.length === 0) logText = data;
            else logText = logText + "\n" + data;
            log.innerHTML = logText;
          },
        });

    this.setState({wiretap: wiretap});
  },
});