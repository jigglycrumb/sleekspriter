import React from "react";
import classnames from "classnames";
import FrameboxFrame from "./FrameboxFrame.js";
import FrameboxOnionPanel from "./FrameboxOnionPanel";

import { t } from "../../utils";
import { Hotkeys } from "../../classes";
const onionHotkey = Hotkeys.bindings.paint[9].key;

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
          {t("Frame")}&nbsp;
          <input type="number" className="frame-number" min="1" max={this.props.totalFrames} value={this.props.selected} onChange={::this.frameSelect} />
          &nbsp;/&nbsp;
          {this.props.totalFrames}

          <button className={onionButtonClasses} onClick={::this.toggleOnion} title={t("Toggle Onion Skinning", {key: onionHotkey})}>
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
