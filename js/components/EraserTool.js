var EraserTool = React.createClass({
  render: function() {
    return (
      <div id="Eraser-Tool" className="ToolComponent">
        <i className="flaticon-double31" style={{position:'relative', left: '0.25em'}}></i>

        <span className="hint">Click a pixel to erase it.</span>
      </div>
    );
  }
});