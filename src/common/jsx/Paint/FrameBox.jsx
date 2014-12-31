var FrameBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    var containerStyle = {},
        frameStyle = {},
        frames = [], // array for mapping the frame components
        frameSize = Math.floor(180/this.props.editor.frames.x)-1;

    for(var i=0; i < this.props.editor.frames.total; i++) frames[i] = i+1;

    containerStyle.width = (frameSize+1)*this.props.editor.frames.x;
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
                  'selected': frame == this.props.editor.frames.selected,
                  'top': frame <= this.props.editor.frames.x,
                  'right': frame % this.props.editor.frames.x == 0,
                  'bottom': frame > this.props.editor.frames.total - this.props.editor.frames.x,
                  'left': (frame-1) % this.props.editor.frames.x == 0,
                });

            var clickHandler = function() {
              channel.publish('frame.select', {frame: frame});
            };

            return (
              <div key={id} className={classes} style={frameStyle} onClick={clickHandler}>
                <FrameCanvas
                  id={frame}
                  width={this.props.editor.file.size.width}
                  height={this.props.editor.file.size.height}
                  size={frameSize} />
              </div>
            );
          }, this)}
          </div>
          <div className="actions">
            Frame&nbsp;
            <input type="number" className="frame-number" min="1" max={this.props.editor.frames.total} value={this.props.editor.frames.selected} onChange={this.dispatchFrameSelected} />
            &nbsp;/&nbsp;
            {this.props.editor.frames.total}
          </div>
        </div>
      </div>
    );
  },
  dispatchFrameSelected: function(event) {
    channel.publish('frame.select', {frame: parseInt(event.target.value)});
  }
});