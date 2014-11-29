var AnimationTimelineFrame = React.createClass({
  render: function() {
    return (
      <div className="frame">
        <FrameCanvas
          id={this.props.frame}
          width={this.props.editor.file.size.width}
          height={this.props.editor.file.size.height}
          size={this.props.size} />
        <label>{this.props.frame}</label>
      </div>
    )
  },
});