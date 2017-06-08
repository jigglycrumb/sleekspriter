import React from "react";
import classnames from "classnames";
import FrameboxFrame from "./FrameboxFrame.js";

class Framebox extends React.Component {
  render() {
    const
      maxWidth = 206,
      frameSize = Math.floor(maxWidth/this.props.frames.x) - 1,
      // TODO: move the calculation of total frames to reselect and cache it (derived state)
      totalFrames = this.props.frames.x * this.props.frames.y,
      onionButtonClasses = classnames({
        "toggle-onion": true,
        "transparent": true,
        "active": this.props.onion.active,
      });

    let
      frameStyle = {},
      frames = [];

    frameStyle.width = frameSize;
    frameStyle.height = frameSize;

    for(var i=0; i < totalFrames; i++) frames.push(i+1);

    // var self = this,

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
      onionPanel = null,
      onionFrame = 1;

    return (
      <div>
        <div id="FrameBoxFrames">
        {frames.map(function(frame) {
          return <FrameboxFrame key={frame} size={frameSize} selected={this.props.selected} frame={frame} frameSelect={this.props.frameSelect}/>;
        }, this)}
        </div>
        <div className="actions">
          Frame&nbsp;
          <input type="number" className="frame-number" min="1" max={totalFrames} value="1" />
          &nbsp;/&nbsp;
          {totalFrames}

          <button className={onionButtonClasses} onClick={::this.toggleOnion}>
            <i className="flaticon-vegetable38"></i>
          </button>
        </div>
        {onionPanel}
      </div>
    );

  }

  toggleOnion() {
    this.props.toggleOnion();
  }
}

export default Framebox;
