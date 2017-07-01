import React from "react";
import SelectionPattern from "../helper/SelectionPattern";
import {
  LayerCanvas,
  FrameCanvas
} from "../canvases";

const ScreenHelper = (props) => {

  let layerPixels, framePixels;
  try {
    framePixels = props.pixels[props.frame];
  }
  catch(e) {
    framePixels = null;
  }

  try {
    layerPixels = props.pixels[props.frame][props.layer];
  }
  catch(e) {
    layerPixels = null;
  }

  const layerHelper = props.layer === null
                    ? null
                    : <LayerCanvas frame={props.frame} layer={props.layer} size={props.size} zoom={1} pixels={layerPixels} />;

  return (
    <section className="screen helper">
      <div className="area top">
        <h1>Helpers</h1>
      </div>

      <div className="area center">
        <SelectionPattern />
        <div id="LayerHelper">
          {layerHelper}
        </div>
        <div id="FrameHelper">
          <FrameCanvas
            frame={props.frame}
            size={props.size}
            zoom={1}
            noAlpha={true}
            pixels={framePixels} />
        </div>
      </div>
    </section>
  );
};

export default ScreenHelper;
