import React from "react";
import PropTypes from "prop-types";

import { t } from "../../../utils";
import config from "../../../config";
import { exportFormats } from "../../../const";

const ExportButton = props => {
  const exportFile = () => {
    const { file, format, exportStatus } = props;

    const fileName = file.name || config.defaultName;

    const mimeType =
      format === exportFormats.jpg ? "image/jpeg" : `image/${format}`;

    const canvas = document
      .getElementById("ExportPreview")
      .querySelectorAll("canvas")[0];
    const img = canvas.toDataURL(mimeType, 1);
    const downloadLink = document.createElement("a");

    downloadLink.href = img;
    downloadLink.download = `${fileName}.${format}`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    exportStatus(t("Export finished"));

    setTimeout(() => {
      exportStatus("");
    }, 5000);
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
  file: PropTypes.object.isRequired,
  format: PropTypes.string.isRequired,
  exportStatus: PropTypes.func.isRequired,
};

export default ExportButton;
