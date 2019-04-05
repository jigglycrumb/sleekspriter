import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { SpritesheetCanvas } from "../canvases";

const ExportPreviewSpritesheet = ({
  background,
  format,
  frames,
  layers,
  size,
  pixels,
  zoom,
}) => {
  const classes = {
    preview: true,
    checkerboard: !!(format === "png" || format === "gif"),
  };
  const style = {
    width: frames.x * size.width * zoom,
    height: frames.y * size.height * zoom,
  };

  background = format === "jpeg" ? background : null;

  return (
    <div className={classnames(classes)} style={style}>
      <SpritesheetCanvas
        frames={frames}
        layers={layers}
        size={size}
        zoom={zoom}
        pixels={pixels || null}
        background={background}
      />
    </div>
  );
};

ExportPreviewSpritesheet.propTypes = {
  format: PropTypes.string.isRequired,
  frames: PropTypes.object.isRequired,
  layers: PropTypes.array.isRequired,
  size: PropTypes.object.isRequired,
  pixels: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default ExportPreviewSpritesheet;
