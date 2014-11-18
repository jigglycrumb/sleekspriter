var AnimationPreviewBox = React.createClass({
  render: function() {
    return (
      <div id="AnimationPreviewBox">
        <h5>Preview</h5>
        <div ref="inner" className="inner">
          <AnimationPreviewBoxPreview
            ref="preview"
            id={1}
            width={this.props.editor.file.size.width}
            height={this.props.editor.file.size.height} />
        </div>
      </div>
    )
  },
  componentDidMount: function() {
    var inner = this.refs.inner.getDOMNode();
    // this is a little ugly but works for now
    // ideally, the canvas should be aware of size changes itself
    // e.g. window resizes don't work yet
    this.refs.preview.scale(inner.clientWidth, inner.clientHeight);
  },
});