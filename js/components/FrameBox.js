var FrameBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    return (
      <div id="FrameBox" className="box">
        <h4 className="foldable-handle">Frames</h4>
        <div className="foldable-fold">
          <div></div>
          <div className="actions">

          </div>
        </div>
      </div>
    );
  }
});