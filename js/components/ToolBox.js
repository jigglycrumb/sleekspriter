// clean
var ToolBox = React.createClass({
  render: function() {

    var titles = {
      brushTool: 'Brush Tool ('+hotkeys.actions.selectBrushTool.key+')',
      eraserTool: 'Eraser Tool ('+hotkeys.actions.selectEraserTool.key+')',
      eyedropperTool: 'Eyedropper Tool ('+hotkeys.actions.selectEyedropperTool.key+')',
      rectangularSelectionTool: 'Selection Tool ('+hotkeys.actions.selectRectangularSelectionTool.key+')',
      brightnessTool: 'Brightness Tool ('+hotkeys.actions.selectBrightnessTool.key+')',
      moveTool: 'Move Tool ('+hotkeys.actions.selectMoveTool.key+')',
      zoomTool: 'Zoom Tool ('+hotkeys.actions.selectZoomTool.key+')',
    };

    return (
      <div id="ToolBox">
        <h4>Tools</h4>
        <div>
          <ToolBoxTool id="BrushTool" title={titles.brushTool} icon="flaticon-small23" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="EraserTool" title={titles.eraserTool} icon="flaticon-double31" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="EyedropperTool" title={titles.eyedropperTool} icon="flaticon-eyedropper2" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="RectangularSelectionTool" title={titles.rectangularSelectionTool} icon="flaticon-selection7" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="BrightnessTool" title={titles.brightnessTool} icon="flaticon-sun4" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="MoveTool" title={titles.moveTool} icon="flaticon-move11" editor={this.props.editor} signal={this.props.signal} />
          <ToolBoxTool id="ZoomTool" title={titles.zoomTool} icon="flaticon-magnifier5" editor={this.props.editor} signal={this.props.signal} />
        </div>
      </div>
    );
  }
});