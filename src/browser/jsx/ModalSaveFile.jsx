var ModalSaveFile = React.createClass({
  mixins: [FluxMixin, TouchMixin, ModalBasicMixin],
  render: function() {
    return (
      <div className="dialog">
        <div className="title">Save file</div>
        <div className="text">Please copy everything below to a .txt file</div>
        <textarea className="json-input" ref="jsonInput" autoFocus></textarea>
        <div className="actions">
          <button onClick={this.handleClick.bind(this, this.hide)} onTouchStart={this.handleTouch.bind(this, this.hide)}>Ok</button>
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    this.refs.jsonInput.value = this.getFlux().stores.FileStore.toJSON();
    this.refs.jsonInput.select();
  },
});
