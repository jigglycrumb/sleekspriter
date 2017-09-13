import React from "react";
import classnames from "classnames";
import { FrameCanvas } from "../canvases";

const ExportPreviewSingleFrame = ({ format, frame, size, pixels, zoom }) => {
  const
    classes = {
      preview: true,
      checkerboard: (format === "png" || format === "gif") ? true : false,
    },
    style = {
      width: size.width * zoom,
      height: size.height * zoom,
    },
    background = format === "jpeg" ? "#ffffff" : null;

  return (
    <div className={classnames(classes)} style={style}>
      <FrameCanvas
        frame={frame}
        size={size}
        zoom={zoom}
        pixels={pixels[frame] || null}
        background={background} />
    </div>
  );
};

export default ExportPreviewSingleFrame;
