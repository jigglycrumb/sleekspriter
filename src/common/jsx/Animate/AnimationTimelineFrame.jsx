var AnimationTimelineFrame = React.createClass({
  render: function() {
    var cssClass = React.addons.classSet({
      frame: true,
      selected: this.props.selected,
    });

    return (
      <div className={cssClass} onClick={this.dispatchFrameSelect}>
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
    var data = {
      frame: this.props.frame,
      position: this.props.position,
    };

    channel.gui.publish('animation.frame.select', data);
  },
  dispatchFrameDelete: function(event) {
    event.stopPropagation();

    var data = {
      animation: this.props.editor.animations.selected,
      frame: this.props.frame,
      position: this.props.position,
    };

    channel.file.publish('file.animation.frame.delete', data);
  },
});