import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { FrameCanvas } from "../canvases";

const ExportPreviewSingleFrame = ({ format, frame, size, pixels, zoom }) => {
  const classes = {
      preview: true,
      checkerboard: format === "png" || format === "gif" ? true : false
    },
    style = {
      width: size.width * zoom,
      height: size.height * zoom
    },
    background = format === "jpeg" ? "#ffffff" : null;

  return (
    <div className={classnames(classes)} style={style}>
      <FrameCanvas
        frame={frame}
        size={size}
        zoom={zoom}
        pixels={pixels[frame] || null}
        background={background}
      />
    </div>
  );
};

ExportPreviewSingleFrame.propTypes = {
  format: PropTypes.string.isRequired,
  frame: PropTypes.number.isRequired,
  size: PropTypes.object.isRequired,
  pixels: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired
};

export default ExportPreviewSingleFrame;
