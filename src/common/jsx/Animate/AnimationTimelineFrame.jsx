// editor: done
var AnimationTimelineFrame = React.createClass({
  render: function() {
    var cssClass = classNames({
      frame: true,
      selected: this.props.selected,
    });

    return (
      <div className={cssClass} onClick={this.dispatchFrameSelect}>
        <FrameCanvas
          id={this.props.frame}
          width={this.props.file.size.width}
          height={this.props.file.size.height}
          size={this.props.size}
          ui={this.props.ui}
          file={this.props.file}  />

        <label>{this.props.frame}</label>
        <button className="transparent delete" onClick={this.dispatchFrameDelete}><span>&times;</span></button>
      </div>
    )
  },
  dispatchFrameSelect: function() {
    var data = {
      frame: this.props.frame,
      position: this.props.position,
    };

    channel.gui.publish('animation.frame.select', data);
  },
  dispatchFrameDelete: function(event) {
    event.stopPropagation();

    var data = {
      animation: this.props.ui.animations.selected,
      frame: this.props.frame,
      position: this.props.position,
    };

    channel.file.publish('animation.frame.delete', data);
  },
});