var FrameBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    var totalFrames = this.props.io.frames.x * this.props.io.frames.y,
        frames = [],
        frameSize = Math.floor(180/this.props.io.frames.x),
        w = frameSize*this.props.io.frames.x,
        l = (200-w)/2;
    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <div id="FrameBox" className="box">
        <h4 className="foldable-handle">Frames</h4>
        <div className="foldable-fold">
          <div id="FrameBoxFrames" style={{width:w, marginLeft:l}}>
          {frames.map(function(frame) {
            var id = 'FrameBoxFrame-'+frame;
            return (
              <FrameBoxFrame key={id} frame={frame} size={frameSize} io={this.props.io} signal={this.props.signal} />
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
    //console.log(event.target.value);
    this.props.signal.frameSelected.dispatch(event.target.value);
  }
});