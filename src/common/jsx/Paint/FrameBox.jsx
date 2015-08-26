// Flux: done
var FrameBox = React.createClass({
  mixins: [FluxMixin, FoldableMixin],
  render: function() {
    var self = this,
        containerStyle = {},
        frameStyle = {},
        frames = [], // array for mapping the frame components
        frameSize = Math.floor(180/this.props.file.frames.x)-1;

    if(frameSize * this.props.file.frames.y > 200) {
      frameSize = Math.floor(180/this.props.file.frames.y)-1;
    }

    for(var i=0; i < this.props.ui.frames.total; i++) frames.push(i+1);

    containerStyle.width = (frameSize+1)*this.props.file.frames.x;
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
                  'selected': frame == this.props.ui.frames.selected,
                  'top': frame <= this.props.file.frames.x,
                  'right': frame % this.props.file.frames.x == 0,
                  'bottom': frame > this.props.ui.frames.total - this.props.file.frames.x,
                  'left': (frame-1) % this.props.file.frames.x == 0,
                });

            var clickHandler = function() {
              self.getFlux().actions.frameSelect(frame);
              self.getFlux().actions.layerTopSelect();
              self.getFlux().actions.scopeSet(null, 'layer');
            };

            return (
              <div key={id} className={classes} style={frameStyle} onClick={clickHandler}>
                <FrameCanvas
                  id={frame}
                  width={this.props.file.size.width}
                  height={this.props.file.size.height}
                  size={frameSize}
                  ui={this.props.ui}
                  file={this.props.file}  />
              </div>
            );
          }, this)}
          </div>
          <div className="actions">
            Frame&nbsp;
            <input type="number" className="frame-number" min="1" max={this.props.ui.frames.total} value={this.props.ui.frames.selected} onChange={this.dispatchFrameSelected} />
            &nbsp;/&nbsp;
            {this.props.ui.frames.total}
          </div>
        </div>
      </div>
    );
  },
  dispatchFrameSelected: function(event) {
    this.getFlux().actions.frameSelect(parseInt(event.target.value));
    this.getFlux().actions.layerTopSelect();
    this.getFlux().actions.scopeSet(null, 'layer');
  }
});