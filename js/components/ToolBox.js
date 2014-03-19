// clean
var ToolBox = React.createClass({
  render: function() {
    return (
      <div id="ToolBox">
        <h4>Tools</h4>
        <div>
          <ToolBoxTool id="BrushTool" title="Brush" icon="flaticon-small23" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="EraserTool" title="Eraser" icon="flaticon-double31" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="EyedropperTool" title="Eyedropper" icon="flaticon-eyedropper2" editor={this.props.editor} signal={this.props.signal} />
          {/*
          <ToolBoxTool id="FillTool" title="Fill tool" icon="icon-bucket" signal={this.props.signal} />
          <ToolBoxTool id="RectangularSelectionTool" title="Selection tool" icon="" signal={this.props.signal} />
          <ToolBoxTool id="MoveTool" title="Move tool" icon="" signal={this.props.signal} />
          <ToolBoxTool id="HandTool" title="Hand tool" icon="icon-magnet" signal={this.props.signal} />
          */}
          <ToolBoxTool id="ZoomTool" title="Zoom" icon="flaticon-magnifier5" editor={this.props.editor} signal={this.props.signal} />
        </div>
      </div>
    );
  }
});