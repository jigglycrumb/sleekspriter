var StageBoxCursorCanvas = React.createClass({
  mixins: [StageBoxCanvasMixin, PostalSubscriptionMixin],
  render: function() {
    return (
      <canvas id="StageBoxCursorCanvas" className="Layer" width={this.props.width} height={this.props.height} />
    );
  },
  getInitialState: function() {
    return {
      subscriptions: {
        'cursor.set': this.drawPixelCursor,
      }
    }
  },
  drawPixelCursor: function() {

    this.clear();

    var zoom = this.props.editor.zoom.current,
        x = this.props.editor.cursor.position.x,
        y = this.props.editor.cursor.position.y;

    if(x == 0 && y == 0) return;

    var canvas = this.getDOMNode(),
        ctx = canvas.getContext('2d');

    ctx.strokeStyle="#FF0000";

    var left = (x*zoom)-zoom+0.5,
        right = (x*zoom)+0.5,
        top = (y*zoom)-zoom+0.5,
        bottom = (y*zoom)+0.5;

    if(zoom < 3) {
      right++;
      bottom++;
    }

    ctx.beginPath();

    if(x > 1) {
      ctx.moveTo(left, 0);
      ctx.lineTo(left, canvas.height);
    }

    if(x < (canvas.width/zoom)) {
      ctx.moveTo(right, 0);
      ctx.lineTo(right, canvas.height);
    }

    if(y > 1) {
      ctx.moveTo(0, top);
      ctx.lineTo(canvas.width, top);
    }

    if(y < (canvas.height/zoom)) {
      ctx.moveTo(0, bottom);
      ctx.lineTo(canvas.width, bottom);
    }

    ctx.stroke();
  },
});