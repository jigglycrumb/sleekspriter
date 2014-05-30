/** @jsx React.DOM */
var FrameBoxFrame = React.createClass({
  mixins:[CopyFrameMixin],
  render: function() {

    var style = fitCanvasIntoSquareContainer(this.props.editor.size.width, this.props.editor.size.height, this.props.size);

    return (
      <canvas
        width={style.width}
        height={style.height}
        style={style} />
    );
  }
});