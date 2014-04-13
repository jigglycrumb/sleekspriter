// clean
var ToolBox = React.createClass({
  render: function() {
    return (
      <div id="ToolBox">
        <h4>Tools</h4>
        <div>
          <ToolBoxTool id="BrushTool" title="Brush Tool" icon="flaticon-small23" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="EraserTool" title="Eraser Tool" icon="flaticon-double31" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="EyedropperTool" title="Eyedropper Tool" icon="flaticon-eyedropper2" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="RectangularSelectionTool" title="Selection Tool" icon="flaticon-selection7" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="BrightnessTool" title="Brightness Tool" icon="flaticon-sun4" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="MoveTool" title="Move Tool" icon="flaticon-move11" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="ZoomTool" title="Zoom Tool" icon="flaticon-magnifier5" editor={this.props.editor} signal={this.props.signal} />
        </div>
      </div>
    );
  }
});