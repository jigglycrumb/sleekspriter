import React from "react";
import PropTypes from "prop-types";
import { remote } from "electron";
import { writeFile } from "fs";

import { exportFormats } from "../../../const";
import { t } from "../../../utils";

import { fileDefaultPath } from "./utils";

const { dialog } = remote;

// Decoding base-64 image
// Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = Buffer.from(matches[2], "base64");

  return response;
}

const ExportButton = props => {
  const handleError = error => {
    console.error(error);
  };

  const exportFile = () => {
    const { exportStatus, file, format, zoom } = props;

    const defaultPath = fileDefaultPath(file, format, zoom);

    const mimeType =
      format === exportFormats.jpg ? "image/jpeg" : `image/${format}`;

    const canvas = document
      .getElementById("ExportPreview")
      .querySelectorAll("canvas")[0];

    const filePath = dialog.showSaveDialogSync({
      defaultPath,
      filters: [{ name: "Image", extensions: [format] }],
    });

    if (filePath) {
      const img = canvas.toDataURL(mimeType, 1);
      const buffer = decodeBase64Image(img);

      writeFile(filePath, buffer.data, function(error) {
        if (error) {
          handleError(error);
        }

        exportStatus(t("Export finished"));

        setTimeout(() => {
          exportStatus("");
        }, 5000);
      });
    }
  };

  return (
    <a
      className="button"
      onClick={() => {
        exportFile(props);
      }}>
      {t("Export")}
    </a>
  );
};

ExportButton.propTypes = {
  exportStatus: PropTypes.func.isRequired,
  file: PropTypes.object.isRequired,
  format: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default ExportButton;
