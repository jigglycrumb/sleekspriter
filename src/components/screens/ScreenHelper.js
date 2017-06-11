import React from "react";
import SelectionPattern from "../helper/SelectionPattern";

const ScreenHelper = (props) => {
  return (
    <section className="screen helper">
      <div className="area top">
        <h1>Helpers</h1>
      </div>

      <div className="area center">
        <SelectionPattern />
        <div id="LayerHelper">
          {/*<LayerCanvas zoom={1} layer={this.props.ui.layers.selected} file={this.props.file} pixels={this.props.pixels} />*/}
        </div>
        <div id="FrameHelper">
          {/*<FrameCanvas zoom={1} frame={this.props.ui.frames.selected} file={this.props.file} pixels={this.props.pixels} noAlpha={true} />*/}
        </div>
      </div>
    </section>
  );
};

export default ScreenHelper;
