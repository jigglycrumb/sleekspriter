var AnimationPreviewBox = React.createClass({
  getInitialState: function() {
    return {
      frame: 1,
    }
  },
  render: function() {

    var preview = null;
    if(this.state.frame > 0) {
      preview =
        <AnimationPreviewBoxPreview
          ref="preview"
          id={1}
          width={this.props.editor.file.size.width}
          height={this.props.editor.file.size.height} />
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
    if(this.refs.preview) {
      var inner = this.refs.inner.getDOMNode();
      // this is a little ugly but works for now
      // ideally, the canvas should be aware of size changes itself
      // e.g. window resizes don't work yet
      this.refs.preview.scale(inner.clientWidth, inner.clientHeight);
    }
  },
});