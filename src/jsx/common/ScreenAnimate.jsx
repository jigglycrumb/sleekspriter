var ScreenAnimate = React.createClass({
  render: function() {
    return (
      <section className="screen animate">
        <div className="area left">
          <AnimationFrameBox editor={this.props.editor} />
        </div>

        <div className="area right">
          <AnimationPreviewBox editor={this.props.editor} />
        </div>

        <div className="area center">
          <AnimationTimelineBox />
        </div>

        <div className="area bottom">
          <AnimationControlBox />
        </div>

        <AnimationList animations={this.props.editor.animations.list} />
      </section>
    )
  }
});