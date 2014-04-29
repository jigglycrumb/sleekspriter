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
      self.drawSelection(self.props.editor.selection.start, self.props.editor.selection.end);
    }

    function moveSelection(distance) {
      var newStart = new Point(
        editor.selection.start.x + distance.x,
        editor.selection.start.y + distance.y
      );

      var newEnd = new Point(
        editor.selection.end.x + distance.x,
        editor.selection.end.y + distance.y
      );

      self.drawSelection(newStart, newEnd);
    }

    switch(this.props.editor.tool) {
      case 'RectangularSelectionTool':
        if(editor.selectionMoving()) moveSelection(editor.selection.distance);
        else if(editor.selectionResizing()) {
          this.drawSelection(editor.selection.start, editor.selection.cursor);
        }
        else if(editor.selectionActive()) drawLastSelection();
        break;
      case 'MoveTool':
        if(editor.selectionMoving()) moveSelection(editor.selection.distance);
        else if(editor.selectionActive()) drawLastSelection();
        break;
      default:
        if(editor.selectionActive()) drawLastSelection();
        break;
    }
  },

  componentDidMount: function() {
    // animate the selection by redrawing the selection pattern from offscreen canvas every 200ms
    var self = this;
    this.interval = setInterval(function() {
      if(editor.selectionActive()) self.forceUpdate();
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