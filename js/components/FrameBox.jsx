/** @jsx React.DOM */
var FrameBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    var containerStyle = {},
        frameStyle = {},
        frames = [], // array for mapping the frame components
        totalFrames = this.props.editor.frames.x * this.props.editor.frames.y,
        frameSize = Math.floor(180/this.props.editor.frames.x)-1;

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    containerStyle.width = ((frameSize+1)*this.props.editor.frames.x);
    containerStyle.marginLeft = (200-containerStyle.width)/2;

    frameStyle.width = frameSize;
    frameStyle.height = frameSize;

    return (
      <div id="FrameBox" className="box">
        <h4 className="foldable-handle">Frames</h4>
        <div className="foldable-fold">
          <div id="FrameBoxFrames" style={containerStyle}>
          {frames.map(function(frame) {
            var id = 'FrameBoxFrame-'+frame,
                classes = React.addons.classSet({
                  'frame': true,
                  'selected': frame == this.props.editor.frame,
                  'top': frame <= this.props.editor.frames.x,
                  'right': frame % this.props.editor.frames.x == 0,
                  'bottom': frame > totalFrames - this.props.editor.frames.x,
                  'left': (frame-1) % this.props.editor.frames.x == 0,
                });

            var clickHandler = function() {
              channel.publish('app.frame.select', {frame: frame});
            };

            return (
              <div key={id} className={classes} style={frameStyle} onClick={clickHandler}>
                <FrameBoxFrame
                  id={frame}
                  width={this.props.editor.size.width}
                  height={this.props.editor.size.height}
                  size={frameSize} />
              </div>
            );
          }, this)}
          </div>
          <div className="actions">
            Frame&nbsp;
            <input type="number" className="frame-number" min="1" max={totalFrames} value={this.props.editor.frame} onChange={this.dispatchFrameSelected} />
            &nbsp;of&nbsp;
            {totalFrames}
          </div>
        </div>
      </div>
    );
  },
  dispatchFrameSelected: function(event) {
    channel.publish('app.frame.select', {frame: parseInt(event.target.value)});
  }
});