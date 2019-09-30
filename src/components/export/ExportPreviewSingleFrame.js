import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { FrameCanvas } from "../canvases";
import { exportFormats } from "../../const";
import { sizeShape } from "../../shapes";

const ExportPreviewSingleFrame = ({
  background,
  format,
  frame,
  layers,
  size,
  pixels,
  zoom,
}) => {
  const classes = {
    preview: true,
    checkerboard: !!(format === exportFormats.png || format === "gif"),
  };
  const style = {
    width: size.width * zoom,
    height: size.height * zoom,
  };

  background = format === exportFormats.jpg ? background : null;

  return (
    <div className={classnames(classes)} style={style}>
      <FrameCanvas
        background={background}
        frame={frame}
        layers={layers}
        pixels={pixels[frame] || null}
        size={size}
        zoom={zoom}
      />
    </div>
  );
};

ExportPreviewSingleFrame.propTypes = {
  background: PropTypes.string,
  format: PropTypes.string.isRequired,
  frame: PropTypes.number.isRequired,
  layers: PropTypes.array.isRequired,
  pixels: PropTypes.object.isRequired,
  size: sizeShape.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default ExportPreviewSingleFrame;
