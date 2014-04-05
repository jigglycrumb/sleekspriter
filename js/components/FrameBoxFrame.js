var FrameBoxFrame = React.createClass({
  mixins:[CopyFrameMixin],
  render: function() {

    var style = fitCanvasIntoSquareContainer(this.props.file.size.width, this.props.file.size.height, this.props.size);

    return (
      <canvas
        width={style.width}
        height={style.height}
        style={style} />
    );
  }
});