/** @jsx React.DOM */
var AnimationFrameBox = React.createClass({
  render: function() {
    var containerStyle = {},
        frames = [], // array for mapping the frame components
        frameSize = 100,
        totalFrames = this.props.editor.file.frames.x * this.props.editor.file.frames.y;

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    containerStyle.width = (frameSize+1)*this.props.editor.file.frames.x;

    return (
      <div id="AnimationFrameBox">
        <h5>Frames</h5>
        <div className="scroller">
          <div className="inner" style={containerStyle}>
          {frames.map(function(frame) {
            return (
              <AnimationFrameBoxFrame key={frame} frame={frame} size={frameSize} editor={this.props.editor} />
            );
          }, this)}
          </div>
        </div>
      </div>
    );
  },
});