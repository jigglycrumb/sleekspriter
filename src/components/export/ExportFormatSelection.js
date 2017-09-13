import React from "react";
import { t } from "../../utils";

const ExportFormatSelection = ({ format, part, setFormat }) => {
  let formats = ["png", "jpg"];
  if(part === "animation") {
    formats = ["gif"]; //, "mov"];
  }

  return (
    <div>
      <h6>{t("Output")}</h6>
      <ul>
        <li>
          <select onChange={(e) => setFormat(e.target.value)} value={format}>
            {formats.map(function(format) {
              return( <option key={format} value={format === "jpg" ? "jpeg" : format}>{format}</option> );
            }, this)}
          </select>
        </li>
      </ul>
    </div>
  );
};

export default ExportFormatSelection;
