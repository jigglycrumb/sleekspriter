/** @jsx React.DOM */
var StageBoxSelectionCanvas = React.createClass({
  mixins: [StageBoxCanvasMixin],
  render: function() {
    return (
      <canvas id="StageBoxSelectionCanvas" className="Layer" width={this.props.width} height={this.props.height} />
    );
  },

  componentDidUpdate: function(prevProps, prevState) {

    this.clear();

    function drawLastSelection() {
      this.drawSelection(this.props.editor.selection.bounds.start, this.props.editor.selection.bounds.end);
    }

    function moveSelection(distance) {
      var newStart = new Point(
        this.props.editor.selection.bounds.start.x + distance.x,
        this.props.editor.selection.bounds.start.y + distance.y
      );

      var newEnd = new Point(
        this.props.editor.selection.bounds.end.x + distance.x,
        this.props.editor.selection.bounds.end.y + distance.y
      );

      this.drawSelection(newStart, newEnd);
    }

    switch(this.props.editor.tool) {
      case 'RectangularSelectionTool':
        if(this.props.editor.selection.isMoving) moveSelection.call(this, this.props.editor.selection.bounds.distance);
        else if(this.props.editor.selection.isResizing) {
          this.drawSelection(this.props.editor.selection.bounds.start, this.props.editor.selection.bounds.cursor);
        }
        else if(this.props.editor.selection.isActive) drawLastSelection.call(this);
        break;
      case 'MoveTool':
        if(this.props.editor.selection.isMoving) moveSelection.call(this, this.props.editor.selection.bounds.distance);
        else if(this.props.editor.selection.isActive) drawLastSelection.call(this);
        break;
      default:
        if(this.props.editor.selection.isActive) drawLastSelection.call(this);
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