import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import FrameboxFrame from "./FrameboxFrame.js";
import FrameboxOnionPanel from "./FrameboxOnionPanel";

import { t } from "../../utils";
import { Hotkeys } from "../../classes";
import { sizeShape, framesShape, onionShape } from "../../shapes";

const onionHotkey = Hotkeys.bindings.paint[9].key;

class Framebox extends React.Component {
  constructor(props) {
    super(props);
    this.frameSelect = this.frameSelect.bind(this);
    this.toggleOnion = this.toggleOnion.bind(this);
  }

  render() {
    const maxWidth = 206;
    const frameSize = Math.floor(maxWidth / this.props.frames.x) - 1;
    const onionButtonClasses = classnames({
      "toggle-onion": true,
      transparent: true,
      active: this.props.onion.active,
    });
    const onionPanel =
      this.props.onion.active !== true ? null : (
        <FrameboxOnionPanel
          onion={this.props.onion}
          onionFrame={this.props.onionFrame}
          onionMode={this.props.onionMode}
          totalFrames={this.props.totalFrames}
        />
      );

    const frames = [];
    for (var i = 0; i < this.props.totalFrames; i++) frames.push(i + 1);

    return (
      <div>
        <div id="FrameBoxFrames">
          {frames.map(frame => {
            const layers = this.props.layers.filter(
              layer => layer.frame === frame
            );

            return (
              <FrameboxFrame
                key={frame}
                size={this.props.size}
                maxSize={frameSize}
                selected={this.props.selected}
                onionSelected={
                  this.props.onion.active &&
                  this.props.onionFrameAbsolute === frame
                }
                pixels={this.props.pixels[frame] || undefined}
                frame={frame}
                frameSelect={this.props.frameSelect}
                layers={layers}
                registerFrameCanvas={this.props.registerFrameCanvas}
              />
            );
          }, this)}
        </div>
        <div className="actions">
          {t("Frame")}
          &nbsp;
          <input
            type="number"
            className="frame-number"
            min="1"
            max={this.props.totalFrames}
            value={this.props.selected}
            onChange={this.frameSelect}
          />
          &nbsp;/&nbsp;
          {this.props.totalFrames}
          <button
            className={onionButtonClasses}
            onClick={this.toggleOnion}
            title={t("Toggle Onion Skinning", { key: onionHotkey })}>
            <i className="flaticon-vegetable38" />
          </button>
        </div>
        {onionPanel}
      </div>
    );
  }

  frameSelect(e) {
    this.props.frameSelect(e.target.value);
  }

  toggleOnion() {
    this.props.onionToggle();
  }
}

Framebox.propTypes = {
  frames: framesShape.isRequired,
  frameSelect: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  onion: onionShape.isRequired,
  onionFrame: PropTypes.func.isRequired,
  onionFrameAbsolute: PropTypes.number.isRequired,
  onionMode: PropTypes.func.isRequired,
  onionToggle: PropTypes.func.isRequired,
  registerFrameCanvas: PropTypes.func.isRequired,
  pixels: PropTypes.object,
  selected: PropTypes.number.isRequired,
  size: sizeShape.isRequired,
  totalFrames: PropTypes.number.isRequired,
};

export default Framebox;
