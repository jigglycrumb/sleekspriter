var ModalErrorInvisibleLayer = React.createClass({
  mixins: [FluxMixin, TouchMixin, ModalBasicMixin],
  render: function() {
    return (
      <div className="dialog">
        <div className="title">Error</div>
        <div className="text">Cannot change an invisible or completely transparent layer.</div>
        <div className="actions">
          <button onClick={this.handleClick.bind(this, this.hide)} onTouchStart={this.handleTouch.bind(this, this.hide)}>Ok, got it.</button>
        </div>
      </div>
    )
  },
});
