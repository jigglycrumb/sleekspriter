var ModalLoadFile = React.createClass({
  mixins: [FluxMixin, TouchMixin, ModalBasicMixin],
  render: function() {
    return (
      <div className="dialog">
        <div className="title">Restore file</div>
        <div className="text">Paste the contents of your last save here</div>
        <textarea className="json-input" ref="jsonInput" autoFocus></textarea>
        <div className="actions">
          <button onClick={this.handleClick.bind(this, this.loadFile)} onTouchStart={this.handleTouch.bind(this, this.loadFile)}>Open</button>
          <button onClick={this.handleClick.bind(this, this.hide)} onTouchStart={this.handleTouch.bind(this, this.hide)}>Cancel</button>
        </div>
      </div>
    );
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
