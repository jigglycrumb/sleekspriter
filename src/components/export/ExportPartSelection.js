import React from "react";
import PropTypes from "prop-types";
import { clamp } from "lodash";
import { t } from "../../utils";

const ExportPartSelection = ({
  frame,
  part,
  totalFrames,
  setFrame,
  setPart
}) => {
  const parts = [
    { part: "spritesheet", label: t("Spritesheet as single image") },
    {
      part: "frame",
      label: (
        <span>
          {t("Frame")}&nbsp;
          <input
            type="number"
            value={frame}
            min={1}
            max={totalFrames}
            onChange={e => setFrame(clamp(+e.target.value, 1, totalFrames))}
          />
          &nbsp;/&nbsp;
          {totalFrames} {t("as image")}
        </span>
      )
    }
  ];

  return (
    <div>
      <h6>{t("Export")}</h6>
      <ul>
        {parts.map(function(p) {
          return (
            <li key={p.part}>
              <label>
                <input
                  type="radio"
                  name="export-part"
                  value={p.part}
                  checked={p.part === part}
                  onChange={e => setPart(e.target.value)}
                />
                {p.label}
              </label>
            </li>
          );
        }, this)}
      </ul>
    </div>
  );
};

ExportPartSelection.propTypes = {
  frame: PropTypes.number.isRequired,
  part: PropTypes.string.isRequired,
  totalFrames: PropTypes.number.isRequired,
  setFrame: PropTypes.func.isRequired,
  setPart: PropTypes.func.isRequired
};

export default ExportPartSelection;
