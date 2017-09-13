import React from "react";
import { t } from "../../utils";

import ExportPreviewSingleFrame from "./ExportPreviewSingleFrame";

const ExportPreviewSpritesheet = () => <div>ExportPreviewSpritesheet</div>;
const ExportPreviewAllFrames = () => <div>ExportPreviewAllFrames</div>;
const ExportPreviewAnimation = () => <div>ExportPreviewAnimation</div>;

const ExportPreviewbox = ({ format, frame, part, pixels, size, zoom }) => {
  let preview = null;
  switch(part) {
  case "spritesheet":
    preview = <ExportPreviewSpritesheet />;
    break;

  case "allframes":
    preview = <ExportPreviewAllFrames />;
    break;

  case "oneframe":
    preview = <ExportPreviewSingleFrame format={format} frame={frame} size={size} pixels={pixels} zoom={zoom} />;
    break;

  case "animation":
    preview = <ExportPreviewAnimation />;
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
