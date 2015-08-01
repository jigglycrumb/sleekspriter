// Flux: done, editor: done
var AnimationPreviewBox = React.createClass({
  render: function() {
    var preview = null;
    if(this.props.ui.animations.frame !== null) {
      preview =
        <AnimationPreviewBoxPreview
          ref="preview"
          id={this.props.ui.animations.frame}
          width={this.props.file.size.width}
          height={this.props.file.size.height}
          ui={this.props.ui}
          file={this.props.file}  />
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
  componentDidMount: function() {
    this.scalePreview();
  },
  componentDidUpdate: function() {
    this.scalePreview();
  },
  scalePreview: function() {
    if(this.refs.preview) {
      var inner = this.refs.inner.getDOMNode();
      // this is a little ugly but works for now
      // ideally, the canvas should be aware of size changes itself
      // e.g. window resizes don't work yet
      this.refs.preview.scale(inner.clientWidth, inner.clientHeight);
    }
  },
});