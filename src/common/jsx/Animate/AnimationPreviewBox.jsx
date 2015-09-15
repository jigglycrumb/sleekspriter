var AnimationPreviewBox = React.createClass({
  render: function() {
    var preview = null;
    if(this.props.ui.animations.frame !== null) {
      var frame = storeUtils.animations.getSelected().frames[this.props.ui.animations.frame];
      preview = <FrameCanvas frame={frame} file={this.props.file} pixels={this.props.pixels} maxSize={this.props.ui.size.animationPreview} />
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