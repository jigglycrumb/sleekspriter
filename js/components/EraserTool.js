var EraserTool = React.createClass({
  render: function() {
    return (
      <div id="Eraser-Tool" className="ToolComponent">
        <i className="fa fa-eraser"></i>

        <span className="hint">Click a pixel to erase it.</span>
      </div>
    );
  }
});