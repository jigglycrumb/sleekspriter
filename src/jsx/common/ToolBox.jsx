/** @jsx React.DOM */
var ToolBox = React.createClass({
  render: function() {

    var titles = {
      brushTool: 'Brush Tool ('+hotkeys.actions.selectBrushTool.key+')',
      eraserTool: 'Eraser Tool ('+hotkeys.actions.selectEraserTool.key+')',
      eyedropperTool: 'Eyedropper Tool ('+hotkeys.actions.selectEyedropperTool.key+')',
      rectangularSelectionTool: 'Selection Tool ('+hotkeys.actions.selectRectangularSelectionTool.key+')',
      paintBucketTool: 'Paint Bucket Tool ('+hotkeys.actions.selectPaintBucketTool.key+')',
      brightnessTool: 'Brightness Tool ('+hotkeys.actions.selectBrightnessTool.key+')',
      moveTool: 'Move Tool ('+hotkeys.actions.selectMoveTool.key+')',
      zoomTool: 'Zoom Tool ('+hotkeys.actions.selectZoomTool.key+')',
    };

    return (
      <div id="ToolBox">
        <h4>Tools</h4>
        <div>
          <ToolBoxTool id="BrushTool" title={titles.brushTool} icon="flaticon-small23" editor={this.props.editor} />
          <ToolBoxTool id="EraserTool" title={titles.eraserTool} icon="flaticon-double31" editor={this.props.editor} />
          <ToolBoxTool id="EyedropperTool" title={titles.eyedropperTool} icon="flaticon-eyedropper2" editor={this.props.editor} />
          <ToolBoxTool id="RectangularSelectionTool" title={titles.rectangularSelectionTool} icon="flaticon-selection7" editor={this.props.editor} />
          <ToolBoxTool id="PaintBucketTool" title={titles.paintBucketTool} icon="flaticon-paint2" editor={this.props.editor} />
          <ToolBoxTool id="BrightnessTool" title={titles.brightnessTool} icon="flaticon-sun4" editor={this.props.editor} />
          <ToolBoxTool id="MoveTool" title={titles.moveTool} icon="flaticon-move11" editor={this.props.editor} />
          <ToolBoxTool id="ZoomTool" title={titles.zoomTool} icon="flaticon-magnifier5" editor={this.props.editor} />
        </div>
      </div>
    );
  }
});