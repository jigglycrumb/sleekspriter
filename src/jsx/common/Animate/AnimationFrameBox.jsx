/** @jsx React.DOM */
var AnimationFrameBox = React.createClass({
  render: function() {
    var containerStyle = {},
        frameStyle = {},
        frames = [], // array for mapping the frame components
        frameSize = 100,
        totalFrames = this.props.editor.file.frames.x * this.props.editor.file.frames.y;

    for(var i=0; i < totalFrames; i++) frames[i] = i+1;

    containerStyle.width = ((frameSize+1)*this.props.editor.file.frames.x);

    return (
      <div id="AnimationFrameBox">
        <h5>Frames</h5>
        <div className="inner" style={containerStyle}>
        {frames.map(function(frame) {

          var id = 'AnimationFrameBoxFrame-'+frame,
              classes = React.addons.classSet({
                'frame': true,
                'top': frame <= this.props.editor.file.frames.x,
                'right': frame % this.props.editor.file.frames.x == 0,
                'bottom': frame > totalFrames - this.props.editor.file.frames.x,
                'left': (frame-1) % this.props.editor.file.frames.x == 0,
              });

          var clickHandler = function() {
            console.log('clicked frame '+frame);
          };

          return (
            <div key={id} className={classes} onClick={clickHandler}>
              <AnimationFrameBoxFrame
                id={frame}
                width={this.props.editor.file.size.width}
                height={this.props.editor.file.size.height}
                size={frameSize} />
            </div>
          );
        }, this)}
        </div>
      </div>
    );
  }
});