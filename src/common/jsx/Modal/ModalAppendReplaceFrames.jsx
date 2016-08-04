var ModalAppendReplaceFrames = React.createClass({
  mixins: [FluxMixin, TouchMixin, ModalBasicMixin],
  render: function() {
    return (
      <div className="dialog">
        <div className="title">Decision needed</div>
        <div className="text">Append frames to animation or replace existing frames?</div>
        <div className="actions">
          <button onClick={this.handleClick.bind(this, this.appendFrames)} onTouchStart={this.handleTouch.bind(this, this.appendFrames)}>Append</button>
          <button onClick={this.handleClick.bind(this, this.replaceFrames)} onTouchStart={this.handleTouch.bind(this, this.replaceFrames)}>Replace</button>
          <button onClick={this.handleClick.bind(this, this.hide)} onTouchStart={this.handleTouch.bind(this, this.hide)}>Cancel</button>
        </div>
      </div>
    );
  },
  appendFrames: function() {
    var animation = storeUtils.animations.getSelected();
    this.props.ui.modal.data.frames.forEach(function(frame) {
      this.getFlux().actions.animationFrameAdd(this.props.ui.animations.selected, animation.frames.length, frame);
    }, this);
    this.hide();
  },
  replaceFrames: function() {
    this.getFlux().actions.animationFrameEmpty(this.props.ui.animations.selected);
    this.appendFrames();
  },
});
