var StageBoxSelectionCanvas = React.createClass({
  mixins: [StageBoxCanvasMixin],
  render: function() {
    return (
      <canvas id="StageBoxSelectionCanvas" className="Layer" width={this.props.width} height={this.props.height} />
    );
  },

  componentDidMount: function() {
    // animate the selection by redrawing the selection pattern from offscreen canvas every 200ms
    this.interval = setInterval(this.tick, 200);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  tick: function() {

    this.clear();

    switch(this.props.ui.tool) {
      case 'RectangularSelectionTool':
        if(this.props.editor.selection.isMoving) this.moveSelection(this.props.editor.selection.bounds.distance);
        else if(this.props.editor.selection.isResizing) {
          this.drawSelection(this.props.editor.selection.bounds.start, this.props.editor.selection.bounds.cursor);
        }
        else if(this.props.editor.selection.isActive) this.drawLastSelection();
        break;
      case 'MoveTool':
        if(this.props.editor.selection.isMoving) this.moveSelection(this.props.editor.selection.bounds.distance);
        else if(this.props.editor.selection.isActive) this.drawLastSelection();
        break;
      default:
        if(this.props.editor.selection.isActive) this.drawLastSelection();
        break;
    }
  },

  drawSelection: function(start, end) {
    var canvas = this.getDOMNode(),
        zoom = this.props.ui.zoom.selected,
        ctx = canvas.getContext('2d'),
        width = (end.x - start.x),
        height = (end.y - start.y),
        sx,
        sy,
        pattern = ctx.createPattern(document.getElementById('SelectionPattern'), 'repeat');

    if(width >= 0) {
      width++;
      sx = start.x - 1;
    }
    else {
      width--;
      sx = start.x;
    }

    if(height >= 0) {
      height++;
      sy = start.y - 1;
    }
    else {
      height--;
      sy = start.y;
    }

    ctx.strokeStyle = pattern;
    ctx.strokeRect(sx*zoom+0.5, sy*zoom+0.5, (width*zoom)-1, (height*zoom)-1);
  },

  drawLastSelection: function() {
    this.drawSelection(this.props.editor.selection.bounds.start, this.props.editor.selection.bounds.end);
  },

  moveSelection: function(distance) {
    var newStart = new Point(
      this.props.editor.selection.bounds.start.x + distance.x,
      this.props.editor.selection.bounds.start.y + distance.y
    );

    var newEnd = new Point(
      this.props.editor.selection.bounds.end.x + distance.x,
      this.props.editor.selection.bounds.end.y + distance.y
    );

    this.drawSelection(newStart, newEnd);
  },
});