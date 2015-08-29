var AnimationPreviewBox = React.createClass({
  render: function() {
    var preview = null;
    if(this.props.ui.animations.frame !== null) {
      var frame = storeUtils.animations.getSelected().frames[this.props.ui.animations.frame];
      // TODO: use maxSize instead of zoom, limit to DOM container size
      preview = <FrameCanvas frame={frame} file={this.props.file} pixels={this.props.pixels} zoom={1} />
    }

    return (
      <div id="AnimationPreviewBox">
        <h5>Preview</h5>
        <div ref="inner" className="inner">
          {preview}
        </div>
      </div>
    )
  },
});