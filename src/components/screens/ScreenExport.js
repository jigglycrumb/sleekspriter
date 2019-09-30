import React from "react";
import PropTypes from "prop-types";

import { exportFormats } from "../../const";
import { sizeShape, framesShape } from "../../shapes";
import { t } from "../../utils";

import {
  ExportBackgroundSelection,
  ExportButton,
  ExportFormatSelection,
  ExportPartSelection,
  ExportPreviewbox,
  ExportZoomSelection,
} from "../export";

const ScreenExport = props => {
  const {
    background,
    file,
    frame,
    frames,
    format,
    layers,
    part,
    pixels,
    size,
    status,
    zoom,
    totalFrames,
  } = props;

  const backgroundSelection =
    format !== exportFormats.jpg ? null : (
      <ExportBackgroundSelection
        background={background}
        setBackground={props.exportBackground}
      />
    );

  const partSelection =
    totalFrames === 1 ? null : (
      <ExportPartSelection
        frame={frame}
        part={part}
        totalFrames={totalFrames}
        setFrame={props.exportFrame}
        setPart={props.exportPart}
      />
    );

  return (
    <section className="screen export">
      <div className="area left">
        <div>
          <h5>{t("Settings")}</h5>
          {partSelection}
          <ExportZoomSelection
            frames={frames}
            part={part}
            zoom={zoom}
            size={size}
            setZoom={props.exportZoom}
          />
          <ExportFormatSelection
            format={format}
            part={part}
            setFormat={props.exportFormat}
          />
          {backgroundSelection}
          <ExportButton
            file={file}
            format={format}
            exportStatus={props.exportStatus}
          />
        </div>
      </div>

      <div className="area right">
        <ExportPreviewbox
          background={background}
          frame={frame}
          frames={frames}
          format={format}
          layers={layers}
          part={part}
          size={size}
          pixels={pixels}
          zoom={zoom}
        />
      </div>

      <div className="area statusbar">
        <div className="bar">{status}</div>
      </div>
    </section>
  );
};

ScreenExport.propTypes = {
  background: PropTypes.string.isRequired,
  exportBackground: PropTypes.func.isRequired,
  exportFormat: PropTypes.func.isRequired,
  exportFrame: PropTypes.func.isRequired,
  exportPart: PropTypes.func.isRequired,
  exportStatus: PropTypes.func.isRequired,
  exportZoom: PropTypes.func.isRequired,
  file: PropTypes.object.isRequired,
  frame: PropTypes.number.isRequired,
  frames: framesShape.isRequired,
  format: PropTypes.string.isRequired,
  layers: PropTypes.array.isRequired,
  part: PropTypes.string.isRequired,
  pixels: PropTypes.object.isRequired,
  size: sizeShape.isRequired,
  status: PropTypes.string.isRequired,
  totalFrames: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default ScreenExport;
