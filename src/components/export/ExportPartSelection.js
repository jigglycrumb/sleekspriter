import React from "react";
import { clamp } from "lodash";
import { t } from "../../utils";

const ExportPartSelection = ({ frame, part, totalFrames, setFrame, setPart }) => {
  const parts = [
    { name: "spritesheet", el: t("Spritesheet as single image") },
    { name: "oneframe", el:  <span>
                              Frame&nbsp;
                              <input type="number" value={frame} min={1} max={totalFrames} onChange={(e) => setFrame(clamp(+e.target.value, 1, totalFrames))} />
                              &nbsp;/&nbsp;
                              {totalFrames} as image
                            </span> }
  ];

  return (
    <div>
      <h6>{t("Export")}</h6>
      <ul>
        {parts.map(function(p) {
          var checked = p.name === part ? true : false;
          return (
            <li key={p.name}>
              <label>
                <input type="radio" name="export-part" value={p.name} checked={checked} onChange={(e) => setPart(e.target.value)} />
                {p.el}
              </label>
            </li>
          );
        }, this)}
      </ul>
    </div>
  );
};

export default ExportPartSelection;
