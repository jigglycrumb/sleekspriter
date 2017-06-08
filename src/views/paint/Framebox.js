import React from "react";

class Framebox extends React.Component {
  render() {
    // var self = this,
    //     maxWidth = 206,
    //     frameStyle = {},
    //     frames = [], // array for mapping the frame components
    //     frameSize = Math.floor(maxWidth/this.props.file.frames.x)-1;
    //
    // for(var i=0; i < this.props.ui.frames.total; i++) frames.push(i+1);
    //
    // frameStyle.width = frameSize;
    // frameStyle.height = frameSize;
    //
    // var onionFrame = storeUtils.onion.getActualFrame();
    //
    // var onionButtonClasses = {
    //   'toggle-onion': true,
    //   'transparent': true,
    //   'active': this.props.ui.onion.active,
    // };
    //
    // var onionPanel = this.props.ui.onion.active === true ? <FrameBoxOnionPanel ui={this.props.ui} /> : null;
    // var onionToggleTitle = 'Toggle Onion Skinning ('+hotkeys.actions.paint.toggleOnion.key+')';

    const
      frames = [],
      onionButtonClasses = {},
      onionPanel = null;

    return (
      <div>
        <div id="FrameBoxFrames">
        {frames.map(function(frame) {
          frame;
          return null;
          /*
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
            <div key={id} className={classNames(classes)} style={frameStyle} onClick={this.handleClick.bind(this, clickHandler)} onTouchStart={this.handleTouch.bind(this, clickHandler)}>
              <FrameCanvas frame={frame} file={this.props.file} pixels={this.props.pixels} maxSize={frameSize} />
            </div>
          );
          */
        }, this)}
        </div>
        <div className="actions">
          Frame&nbsp;
          <input type="number" className="frame-number" min="1" max="5" value="10" />
          &nbsp;/&nbsp;
          {10}

          <button className={onionButtonClasses}>
            <i className="flaticon-vegetable38"></i>
          </button>
        </div>
        {onionPanel}
      </div>
    );

  }
}

export default Framebox;
