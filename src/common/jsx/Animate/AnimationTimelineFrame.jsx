var AnimationTimelineFrame = React.createClass({
  mixins: [FluxMixin, TouchMixin],
  render: function() {
    var cssClass = classNames({
      frame: true,
      selected: this.props.selected,
    });

    return (
      <div className={cssClass} onClick={this.handleClick.bind(this, this.dispatchFrameSelect)} onTouchStart={this.handleTouch.bind(this, this.dispatchFrameSelect)}>
        <FrameCanvas frame={this.props.frame} file={this.props.file} pixels={this.props.pixels} maxSize={this.props.size} />
        <label>{this.props.frame}</label>
        <button className="transparent delete" onClick={this.handleClick.bind(this, this.dispatchFrameDelete)} onTouchStart={this.handleTouch.bind(this, this.dispatchFrameDelete)}><span>&times;</span></button>
      </div>
    )
  },
  dispatchFrameSelect: function() {
    this.getFlux().actions.animationFrameSelect(this.props.position);
  },
  dispatchFrameDelete: function(event) {
    event.stopPropagation();
    this.getFlux().actions.animationFrameDelete(this.props.ui.animations.selected, this.props.position, this.props.frame);
  },
});
