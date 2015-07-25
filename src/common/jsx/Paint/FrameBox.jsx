var FrameBox = React.createClass({
  mixins: [FluxMixin, FoldableMixin],
  render: function() {

    console.log('FrameBox.render', this.props.frame);

    var self = this,
        containerStyle = {},
        frameStyle = {},
        frames = [], // array for mapping the frame components
        frameSize = Math.floor(180/this.props.frame.x)-1;

    if(frameSize * this.props.frame.y > 200) {
      frameSize = Math.floor(180/this.props.frame.y)-1;
    }

    for(var i=0; i < this.props.frame.total; i++) frames.push(i+1);

    containerStyle.width = (frameSize+1)*this.props.frame.x;
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
                classes = classNames({
                  'frame': true,
                  'selected': frame == this.props.frame.selected,
                  'top': frame <= this.props.frame.x,
                  'right': frame % this.props.frame.x == 0,
                  'bottom': frame > this.props.frame.total - this.props.frame.x,
                  'left': (frame-1) % this.props.frame.x == 0,
                });

            var clickHandler = function() {
              self.getFlux().actions.frameSelect(frame);
            };

            return (
              <div key={id} className={classes} style={frameStyle} onClick={clickHandler}>
                <FrameCanvas
                  id={frame}
                  width={this.props.file.size.width}
                  height={this.props.file.size.height}
                  size={frameSize} />
              </div>
            );
          }, this)}
          </div>
          <div className="actions">
            Frame&nbsp;
            <input type="number" className="frame-number" min="1" max={this.props.frame.total} value={this.props.frame.selected} onChange={this.dispatchFrameSelected} />
            &nbsp;/&nbsp;
            {this.props.frame.total}
          </div>
        </div>
      </div>
    );
  },
  dispatchFrameSelected: function(event) {
    this.getFlux().actions.frameSelect(parseInt(event.target.value));
  }
});