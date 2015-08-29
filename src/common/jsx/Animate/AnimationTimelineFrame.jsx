var AnimationTimelineFrame = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    var cssClass = classNames({
      frame: true,
      selected: this.props.selected,
    });

    return (
      <div className={cssClass} onClick={this.dispatchFrameSelect}>
        <FrameCanvas frame={this.props.frame} file={this.props.file} pixels={this.props.pixels} maxSize={this.props.size} />
        <label>{this.props.frame}</label>
        <button className="transparent delete" onClick={this.dispatchFrameDelete}><span>&times;</span></button>
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