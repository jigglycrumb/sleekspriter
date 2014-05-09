var StageBoxSelectionCanvas = React.createClass({
  mixins: [StageBoxCanvasMixin],
  render: function() {
    return (
      <canvas id="StageBoxSelectionCanvas" className="Layer" width={this.props.width} height={this.props.height} />
    );
  },

  componentDidUpdate: function(prevProps, prevState) {

    this.clear();

    var self = this;

    function drawLastSelection() {
      self.drawSelection(self.props.editor.selection.bounds.start, self.props.editor.selection.bounds.end);
    }

    function moveSelection(distance) {

      //console.log(distance, editor.selection.bounds);

      var newStart = new Point(
        editor.selection.bounds.start.x + distance.x,
        editor.selection.bounds.start.y + distance.y
      );

      var newEnd = new Point(
        editor.selection.bounds.end.x + distance.x,
        editor.selection.bounds.end.y + distance.y
      );

      self.drawSelection(newStart, newEnd);
    }

    switch(this.props.editor.tool) {
      case 'RectangularSelectionTool':
        if(editor.selection.isMoving) moveSelection(editor.selection.bounds.distance);
        else if(editor.selection.isResizing) {
          this.drawSelection(editor.selection.bounds.start, editor.selection.bounds.cursor);
        }
        else if(editor.selection.isActive) drawLastSelection();
        break;
      case 'MoveTool':
        if(editor.selection.isMoving) moveSelection(editor.selection.bounds.distance);
        else if(editor.selection.isActive) drawLastSelection();
        break;
      default:
        if(editor.selection.isActive) drawLastSelection();
        break;
    }
  },

  componentDidMount: function() {
    // animate the selection by redrawing the selection pattern from offscreen canvas every 200ms
    var self = this;
    this.interval = setInterval(function() {
      if(editor.selection.isActive) self.forceUpdate();
    }, 200);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  drawSelection: function(start, end) {
    var canvas = this.getDOMNode(),
        zoom = this.props.editor.zoom,
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
    ctx.strokeRect(sx*zoom+0.5, sy*zoom+0.5, width*zoom, height*zoom);
  },
});