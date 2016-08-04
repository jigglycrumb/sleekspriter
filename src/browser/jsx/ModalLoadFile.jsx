var ModalLoadFile = React.createClass({
  mixins: [FluxMixin, TouchMixin, ModalBasicMixin],
  render: function() {
    return (
      <div className="dialog">
        <div className="title">Open file</div>
        <div className="text">Paste JSON here</div>
        <textarea className="json-input" ref="jsonInput"></textarea>
        <div className="actions">
          <button onClick={this.handleClick.bind(this, this.loadFile)} onTouchStart={this.handleTouch.bind(this, this.loadFile)}>Open</button>
          <button onClick={this.handleClick.bind(this, this.hide)} onTouchStart={this.handleTouch.bind(this, this.hide)}>Cancel</button>
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    this.refs.jsonInput.focus();
  },
  loadFile: function() {
    var input = this.refs.jsonInput.value;
    var json = JSON.parse(input);

    if(json) {
      platformUtils.loadFile(json);
      this.hide();
    }
  },
});
