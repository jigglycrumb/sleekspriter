var PreviewBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {

    var scale = 1,
        maxWidth = 160,
        maxHeight = 90;

    if(this.props.file.size.width > this.props.file.size.height) {
      // scale to width
      scale = Math.floor(maxWidth/this.props.file.size.width);
    }
    else {
      // scale to height
      scale = Math.floor(maxHeight/this.props.file.size.height);
    }

    return (
      <div id="PreviewBox" className="box">
        <h4 className="foldable-handle">Preview</h4>
        <div className="foldable-fold">
          <FrameCanvas frame={this.props.ui.frames.selected} file={this.props.file} pixels={this.props.pixels} zoom={scale} />
        </div>
      </div>
    );
  },
});