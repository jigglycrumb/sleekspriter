import React from "react";
import classnames from "classnames";
import FrameboxFrame from "./FrameboxFrame.js";
import FrameboxOnionPanel from "./FrameboxOnionPanel";

class Framebox extends React.Component {
  render() {
    const
      maxWidth = 206,
      frameSize = Math.floor(maxWidth/this.props.frames.x) - 1,
      onionButtonClasses = classnames({
        "toggle-onion": true,
        "transparent": true,
        "active": this.props.onion.active,
      }),
      onionPanel = this.props.onion.active !== true
                 ? null
                 : <FrameboxOnionPanel
                      onion={this.props.onion}
                      onionFrame={this.props.onionFrame}
                      onionMode={this.props.onionMode}
                      totalFrames={this.props.totalFrames} />;

    let
      frameStyle = {},
      frames = [];

    frameStyle.width = frameSize;
    frameStyle.height = frameSize;

    for(var i=0; i < this.props.totalFrames; i++) frames.push(i+1);

    // var onionToggleTitle = 'Toggle Onion Skinning ('+hotkeys.actions.paint.toggleOnion.key+')';

    return (
      <div>
        <div id="FrameBoxFrames">
        {frames.map(function(frame) {
          return <FrameboxFrame
                  key={frame}
                  size={frameSize}
                  selected={this.props.selected}
                  onionSelected={this.props.onion.active && this.props.onionFrameAbsolute === frame}
                  frame={frame}
                  frameSelect={this.props.frameSelect} />;
        }, this)}
        </div>
        <div className="actions">
          Frame&nbsp;
          <input type="number" className="frame-number" min="1" max={this.props.totalFrames} value={this.props.selected} onChange={::this.frameSelect} />
          &nbsp;/&nbsp;
          {this.props.totalFrames}

          <button className={onionButtonClasses} onClick={::this.toggleOnion}>
            <i className="flaticon-vegetable38"></i>
          </button>
        </div>
        {onionPanel}
      </div>
    );

  }

  frameSelect(e) {
    this.props.frameSelect(e.target.value);
    // TODO: Select top layer after frame change
  }

  toggleOnion() {
    this.props.onionToggle();
  }
}

export default Framebox;
