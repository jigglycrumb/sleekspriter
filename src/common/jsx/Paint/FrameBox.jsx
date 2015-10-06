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

    var onionFrame = storeUtils.onion.getActualFrame();

    var onionButtonClasses = {
      'toggle-onion': true,
      'transparent': true,
      'active': this.props.ui.onion.active,
    };

    var onionPanel = this.props.ui.onion.active === true ? <FrameBoxOnionPanel ui={this.props.ui} /> : null;
    var onionToggleTitle = 'Toggle Onion Skinning ('+hotkeys.actions.paint.toggleOnion.key+')';

    return (
      <div id="FrameBox" className="box">
        <h4 className={classNames(handleClasses)} onClick={this.fold}>Frames</h4>
        <div className="foldable-fold" style={boxStyle}>
          <div id="FrameBoxFrames">
          {frames.map(function(frame) {
            var id = 'FrameBoxFrame-'+frame,
                classes = {
                  'frame': true,
                  'selected': frame == this.props.ui.frames.selected,
                  'onion': this.props.ui.onion.active === true && frame == onionFrame,
                };

            var clickHandler = function() {
              self.getFlux().actions.frameSelect(frame);
              self.getFlux().actions.layerTopSelect();
              self.getFlux().actions.scopeSet(null, 'layer');
            };

            return (
              <div key={id} className={classNames(classes)} style={frameStyle} onClick={clickHandler}>
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

            <button className={classNames(onionButtonClasses)} onClick={this.toggleOnionSkinning} title={onionToggleTitle}>
              <i className="flaticon-vegetable38"></i>
            </button>
          </div>
          {onionPanel}
        </div>
      </div>
    );
  },
  dispatchFrameSelected: function(event) {
    this.getFlux().actions.frameSelect(parseInt(event.target.value));
    this.getFlux().actions.layerTopSelect();
    this.getFlux().actions.scopeSet(null, 'layer');
  },
  toggleOnionSkinning: function() {
    this.getFlux().actions.onionToggle();
  },
});