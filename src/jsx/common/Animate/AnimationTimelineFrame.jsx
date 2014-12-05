var AnimationTimelineFrame = React.createClass({
  render: function() {
    return (
      <div className="frame" onClick={this.dispatchFrameSelect}>
        <FrameCanvas
          id={this.props.frame}
          width={this.props.editor.file.size.width}
          height={this.props.editor.file.size.height}
          size={this.props.size} />
        <label>{this.props.frame}</label>
        <button className="transparent delete" onClick={this.dispatchFrameDelete}><span>&times;</span></button>
      </div>
    )
  },
  dispatchFrameSelect: function() {
    console.log('select frame '+this.props.frame);
  },
  dispatchFrameDelete: function(event) {
    event.stopPropagation();

    var data = {
      animation: this.props.editor.animations.selected,
      frame: this.props.frame,
      position: this.props.position,
    };

    channel.publish('file.animation.frame.delete', data);
  },
});