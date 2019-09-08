import React from "react";
import PropTypes from "prop-types";
import { clamp } from "lodash";

import { t } from "../../utils";
import config from "../../config";
import { sizeShape, framesShape } from "../../shapes";

const { max, min } = config.zoom;

const ExportZoomSelection = ({ frames, part, size, zoom, setZoom }) => {
  let text;
  if (part === "spritesheet") {
    text = (
      <i>
        {t("Frame size: ${w}x${h} pixels", {
          w: size.width * zoom,
          h: size.height * zoom,
        })}
        <br />
        {t("Spritesheet size: ${w}x${h} pixels", {
          w: size.width * frames.x * zoom,
          h: size.height * frames.y * zoom,
        })}
        <br />
      </i>
    );
  } else
    text = (
      <i>
        {t("Image size: ${w}x${h} pixels", {
          w: size.width * zoom,
          h: size.height * zoom,
        })}
      </i>
    );

  return (
    <div>
      <h6>{t("Zoom")}</h6>
      <ul>
        <li>
          <input
            type="range"
            min={min}
            max={max}
            value={zoom}
            onChange={e => setZoom(clamp(+e.target.value, min, max))}
          />
          <input
            type="number"
            min={min}
            max={max}
            value={zoom}
            onChange={e => setZoom(clamp(+e.target.value, min, max))}
          />
        </li>
        <li>{text}</li>
      </ul>
    </div>
  );
};

ExportZoomSelection.propTypes = {
  frames: framesShape.isRequired,
  part: PropTypes.string.isRequired,
  size: sizeShape.isRequired,
  zoom: PropTypes.number.isRequired,
  setZoom: PropTypes.func.isRequired,
};

export default ExportZoomSelection;
