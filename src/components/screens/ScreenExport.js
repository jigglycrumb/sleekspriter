import React from "react";
import PropTypes from "prop-types";

import { sizeShape, framesShape } from "../../shapes";
import { t } from "../../utils";

import {
  ExportBackgroundSelection,
  ExportButton,
  ExportFormatSelection,
  ExportPartSelection,
  ExportPreviewbox,
  ExportStatus,
  ExportZoomSelection,
} from "../export";

class ScreenExport extends React.Component {
  constructor(props) {
    super(props);

    this.export = this.export.bind(this);
  }

  render() {
    const {
      background,
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
    } = this.props;

    const backgroundSelection =
      format !== "jpeg" ? null : (
        <ExportBackgroundSelection
          background={background}
          setBackground={this.props.exportBackground}
        />
      );

    const partSelection =
      totalFrames === 1 ? null : (
        <ExportPartSelection
          frame={frame}
          part={part}
          totalFrames={totalFrames}
          setFrame={this.props.exportFrame}
          setPart={this.props.exportPart}
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
              setZoom={this.props.exportZoom}
            />
            <ExportFormatSelection
              format={format}
              part={part}
              setFormat={this.props.exportFormat}
            />
            {backgroundSelection}
            <ExportButton export={this.export} />
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
          <ExportStatus status={status} setStatus={this.props.exportStatus} />
        </div>
      </section>
    );
  }

  export() {
    // TODO this is currently browser-only
    const { format } = this.props;
    const canvas = document
      .getElementById("ExportPreview")
      .querySelectorAll("canvas")[0];
    const img = canvas.toDataURL(`image/${format}`);
    const downloadLink = document.createElement("a");

    downloadLink.href = img;
    downloadLink.download = `my-pixels.${format === "jpeg" ? "jpg" : format}`; // TODO name file?

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    this.props.exportStatus(t("Export finished"));
  }
}

ScreenExport.propTypes = {
  background: PropTypes.string.isRequired,
  exportBackground: PropTypes.func.isRequired,
  exportFormat: PropTypes.func.isRequired,
  exportFrame: PropTypes.func.isRequired,
  exportPart: PropTypes.func.isRequired,
  exportStatus: PropTypes.func.isRequired,
  exportZoom: PropTypes.func.isRequired,
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
