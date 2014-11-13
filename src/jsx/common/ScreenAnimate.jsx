/** @jsx React.DOM */
var ScreenAnimate = React.createClass({
  render: function() {
    return (
      <section className="screen animate">
        <div className="area top">
          <AnimationTimelineBox />
          <AnimationPreviewBox />
        </div>

        <div className="area center">
          <AnimationFrameBox editor={this.props.editor} />
        </div>

        <div className="area right">
          <AnimationListBox />
        </div>

        <div className="area bottom">
          <div className="bar">
            <label>Drag &amp; drop frames to the timeline to create an animation.</label>
          </div>
        </div>
      </section>
    )
  }
});