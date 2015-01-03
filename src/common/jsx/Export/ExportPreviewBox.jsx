var ExportPreviewBox = React.createClass({
  render: function() {
    var preview = null;

    switch(this.props.part) {
      case 'spritesheet':

        break;

      case 'allframes':

        break;

      case 'oneframe':
        preview = <FrameCanvas
                    id={this.props.frame}
                    width={this.props.editor.file.size.width}
                    height={this.props.editor.file.size.height} />
        break;

      case 'animation':

        break;
    }

    return (
      <div id="ExportPreviewBox">
        <h5>Preview</h5>
        <div ref="inner" className="inner">
          {preview}
        </div>
      </div>
    )
  },
  /*
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
      //this.refs.preview.scale(inner.clientWidth, inner.clientHeight);
      console.log('scale', inner);
    }
  },
  */
});