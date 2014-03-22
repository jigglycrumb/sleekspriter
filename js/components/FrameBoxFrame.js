var FrameBoxFrame = React.createClass({
  mixins:[CopyFrameMixin],
  render: function() {

    var width = this.props.file.size.width*this.props.editor.zoom,
        height = this.props.file.size.height*this.props.editor.zoom,
        style = fitCanvasIntoSquareContainer(width, height, this.props.size);

    return (
      <canvas
        width={width}
        height={height}
        style={style} />
    );
  }
});