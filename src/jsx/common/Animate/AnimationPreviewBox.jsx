var AnimationPreviewBox = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      frame: null,
      subscriptions: {
        'animation.frame.select': this.selectFrame,
      },
    }
  },
  render: function() {

    var preview = null;
    if(this.state.frame !== null) {
      preview =
        <AnimationPreviewBoxPreview
          ref="preview"
          id={this.state.frame}
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
    this.scalePreview();
  },
  componentDidUpdate: function() {
    this.scalePreview();
  },
  selectFrame: function(data) {
    this.setState({frame: data.frame});
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