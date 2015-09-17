var AnimationPreviewBox = React.createClass({
  render: function() {
    var preview = null;
    if(this.props.ui.animations.frame !== null) {
      var frame = storeUtils.animations.getSelected().frames[this.props.ui.animations.frame];

      if(this.props.ui.animations.playing === true)
        preview = <AnimationCanvas
          animation={storeUtils.animations.getSelected()}
          ui={this.props.ui}
          file={this.props.file}
          pixels={this.props.pixels}
          play={this.props.ui.animations.playing}
          maxSize={this.props.ui.size.animationPreview} />
      else
        preview = <FrameCanvas
          frame={frame}
          file={this.props.file}
          pixels={this.props.pixels}
          maxSize={this.props.ui.size.animationPreview} />
    }

    return (
      <div id="AnimationPreviewBox">
        <h5>Preview</h5>
        <div className="inner" id="AnimationPreviewWrapper">
          {preview}
        </div>
      </div>
    )
  },
});