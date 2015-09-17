// Flux: done
var FrameBox = React.createClass({
  mixins: [FluxMixin, FoldableMixin],
  render: function() {
    var self = this,
        maxWidth = 206,
        frameStyle = {},
        frames = [], // array for mapping the frame components
        frameSize = Math.floor(maxWidth/this.props.file.frames.x)-1;

    for(var i=0; i < this.props.ui.frames.total; i++) frames.push(i+1);

    frameStyle.width = frameSize;
    frameStyle.height = frameSize;

    var handleClasses = {'foldable-handle': true},
        boxStyle = {display: 'block'};

    if(this.props.ui.fold.frames === true) {
      handleClasses['folded'] = true;
      boxStyle.display = 'none';
    }

    return (
      <div id="FrameBox" className="box">
        <h4 className={classNames(handleClasses)} onClick={this.fold}>Frames</h4>
        <div className="foldable-fold" style={boxStyle}>
          <div id="FrameBoxFrames">
          {frames.map(function(frame) {
            var id = 'FrameBoxFrame-'+frame,
                classes = classNames({
                  'frame': true,
                  'selected': frame == this.props.ui.frames.selected,
                });

            var clickHandler = function() {
              self.getFlux().actions.frameSelect(frame);
              self.getFlux().actions.layerTopSelect();
              self.getFlux().actions.scopeSet(null, 'layer');
            };

            return (
              <div key={id} className={classes} style={frameStyle} onClick={clickHandler}>
                <FrameCanvas frame={frame} file={this.props.file} pixels={this.props.pixels} maxSize={frameSize} />
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