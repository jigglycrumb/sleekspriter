import React from "react";
import classnames from "classnames";
import { SpritesheetCanvas } from "../canvases";

const ExportPreviewSpritesheet = ({ format, frames, layers, size, pixels, zoom }) => {
  const
    classes = {
      preview: true,
      checkerboard: (format === "png" || format === "gif") ? true : false,
    },
    style = {
      width: frames.x * size.width * zoom,
      height: frames.y * size.height * zoom,
    },
    background = format === "jpeg" ? "#ffffff" : null;

  return (
    <div className={classnames(classes)} style={style}>
      <SpritesheetCanvas
        frames={frames}
        layers={layers}
        size={size}
        zoom={zoom}
        pixels={pixels || null}
        background={background} />
    </div>
  );
};

export default ExportPreviewSpritesheet;
