/** @jsx React.DOM */
var FrameBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    var totalFrames = this.props.editor.frames.x * this.props.editor.frames.y,
        frames = [],
        frameSize = Math.floor(180/this.props.editor.frames.x),
        w = frameSize*this.props.editor.frames.x,
        l = (200-w)/2,
        self = this;

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    return (
      <div id="FrameBox" className="box">
        <h4 className="foldable-handle">Frames</h4>
        <div className="foldable-fold">
          <div id="FrameBoxFrames" style={{width:w, marginLeft:l}}>
          {frames.map(function(frame) {
            var id = 'FrameBoxFrame-'+frame;

            var cssClass = 'frame';
            if(frame == this.props.editor.frame) cssClass+= ' selected';
            if(frame % this.props.editor.frames.x == 0) cssClass+= ' right';
            if(frame <= this.props.editor.frames.x) cssClass+= ' top';

            var clickHandler = function() {
              channel.publish('app.frame.select', {frame: frame});
            }

            return (
              <div key={id} className={cssClass} style={{width:frameSize, height:frameSize}} onClick={clickHandler}>
                <FrameBoxFrame frame={frame} size={frameSize} editor={this.props.editor} />
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
    channel.publish('app.frame.select', {frame: event.target.value});
  }
});