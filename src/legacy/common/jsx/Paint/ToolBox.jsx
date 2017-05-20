var ToolBox = React.createClass({
  render: function() {

    var titles = {
      brushTool: 'Brush Tool ('+hotkeys.actions.paint.selectBrushTool.key+')',
      eraserTool: 'Eraser Tool ('+hotkeys.actions.paint.selectEraserTool.key+')',
      eyedropperTool: 'Eyedropper Tool ('+hotkeys.actions.paint.selectEyedropperTool.key+')',
      rectangularSelectionTool: 'Selection Tool ('+hotkeys.actions.paint.selectRectangularSelectionTool.key+')',
      paintBucketTool: 'Paint Bucket Tool ('+hotkeys.actions.paint.selectPaintBucketTool.key+')',
      brightnessTool: 'Brightness Tool ('+hotkeys.actions.paint.selectBrightnessTool.key+')',
      moveTool: 'Move Tool ('+hotkeys.actions.paint.selectMoveTool.key+')',
      zoomTool: 'Zoom Tool ('+hotkeys.actions.paint.selectZoomTool.key+')',
    };

    return (
      <div id="ToolBox">
        <h4>Tools</h4>
        <div>
          <ToolBoxTool id="BrushTool" title={titles.brushTool} icon="flaticon-small23" ui={this.props.ui} />
          <ToolBoxTool id="EraserTool" title={titles.eraserTool} icon="flaticon-double31" ui={this.props.ui} />
          <ToolBoxTool id="EyedropperTool" title={titles.eyedropperTool} icon="flaticon-eyedropper2" ui={this.props.ui} />
          <ToolBoxTool id="RectangularSelectionTool" title={titles.rectangularSelectionTool} icon="flaticon-selection7" ui={this.props.ui} />
          <ToolBoxTool id="PaintBucketTool" title={titles.paintBucketTool} icon="flaticon-paint2" ui={this.props.ui} />
          <ToolBoxTool id="BrightnessTool" title={titles.brightnessTool} icon="flaticon-sun4" ui={this.props.ui} />
          <ToolBoxTool id="MoveTool" title={titles.moveTool} icon="flaticon-move11" ui={this.props.ui} />
          <ToolBoxTool id="ZoomTool" title={titles.zoomTool} icon="flaticon-magnifier5" ui={this.props.ui} />
        </div>
      </div>
    );
  }
});