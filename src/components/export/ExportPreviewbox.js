import React from "react";
import PropTypes from "prop-types";

import { sizeShape, framesShape } from "../../shapes";
import { t } from "../../utils";

import { ExportPreviewSingleFrame, ExportPreviewSpritesheet } from ".";

const ExportPreviewAllFrames = () => <div>ExportPreviewAllFrames</div>;
const ExportPreviewAnimation = () => <div>ExportPreviewAnimation</div>;

const ExportPreviewbox = ({
  background,
  format,
  frame,
  frames,
  layers,
  part,
  pixels,
  size,
  zoom,
}) => {
  let preview = null;
  switch (part) {
    case "spritesheet":
      preview = (
        <ExportPreviewSpritesheet
          background={background}
          format={format}
          frames={frames}
          layers={layers}
          size={size}
          pixels={pixels}
          zoom={zoom}
        />
      );
      break;

    case "allframes":
      preview = <ExportPreviewAllFrames />; // TODO
      break;

    case "frame":
      preview = (
        <ExportPreviewSingleFrame
          background={background}
          format={format}
          frame={frame}
          size={size}
          pixels={pixels}
          zoom={zoom}
        />
      );
      break;

    case "animation":
      preview = <ExportPreviewAnimation />; // TODO
      break;
  }

  return (
    <div id="ExportPreviewBox">
      <h5>{t("Preview")}</h5>
      <div id="ExportPreview" className="inner">
        {preview}
      </div>
    </div>
  );
};

ExportPreviewbox.propTypes = {
  background: PropTypes.string,
  format: PropTypes.string.isRequired,
  frame: PropTypes.number.isRequired,
  frames: framesShape.isRequired,
  layers: PropTypes.array.isRequired,
  part: PropTypes.string.isRequired,
  pixels: PropTypes.object,
  size: sizeShape.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default ExportPreviewbox;
