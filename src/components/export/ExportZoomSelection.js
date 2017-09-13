import React from "react";
import { clamp } from "lodash";
import { t } from "../../utils";
import config from  "../../config";
const { max, min } = config.zoom;

const ExportZoomSelection = ({ frames, part, size, zoom, setZoom }) => {
  let text;
  if(part === "spritesheet") {

    text = <i>
            {t("Frame size: ${w}x${h} pixels", {w: size.width * zoom, h: size.height * zoom})}<br />
            {t("Spritesheet size: ${w}x${h} pixels", {w: size.width * frames.x * zoom, h: size.height * frames.y * zoom})}<br />
          </i>;
  }
  else text = <i>{t("Image size: ${w}x${h} pixels", {w: size.width * zoom, h: size.height * zoom})}</i>;

  return (
    <div>
      <h6>{t("Zoom")}</h6>
      <ul>
        <li>
          <input type="range" min={min} max={max} value={zoom} onChange={(e) => setZoom(clamp(+e.target.value, min, max))} />
          <input type="number" min={min} max={max} value={zoom} onChange={(e) => setZoom(clamp(+e.target.value, min, max))} />
        </li>
        <li>
          {text}
        </li>
      </ul>
    </div>
  );
};

export default ExportZoomSelection;
