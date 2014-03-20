var FrameBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    var totalFrames = this.props.io.frames.x * this.props.io.frames.y;
    return (
      <div id="FrameBox" className="box">
        <h4 className="foldable-handle">Frames</h4>
        <div className="foldable-fold">
          <div></div>
          <div className="actions">
            Frame
            <input type="number" defaultValue={this.props.editor.frame} />
            of
            {totalFrames}
          </div>
        </div>
      </div>
    );
  }
});