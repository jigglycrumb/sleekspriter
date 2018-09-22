import React from "react";
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

export default ExportPreviewbox;
