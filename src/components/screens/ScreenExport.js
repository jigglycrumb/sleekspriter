import React from "react";
import PropTypes from "prop-types";
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
          setBackground={this.props.setBackground}
        />
      );

    const partSelection =
      totalFrames === 1 ? null : (
        <ExportPartSelection
          frame={frame}
          part={part}
          totalFrames={totalFrames}
          setFrame={this.props.setFrame}
          setPart={this.props.setPart}
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
              setZoom={this.props.setZoom}
            />
            <ExportFormatSelection
              format={format}
              part={part}
              setFormat={this.props.setFormat}
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
          <ExportStatus status={status} setStatus={this.props.setStatus} />
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

    this.props.setStatus(t("Export finished"));
  }
}

ScreenExport.propTypes = {
  background: PropTypes.string.isRequired,
  frame: PropTypes.number.isRequired,
  frames: PropTypes.object.isRequired,
  format: PropTypes.string.isRequired,
  layers: PropTypes.array.isRequired,
  part: PropTypes.string.isRequired,
  pixels: PropTypes.object.isRequired,
  setBackground: PropTypes.func.isRequired,
  setFormat: PropTypes.func.isRequired,
  setFrame: PropTypes.func.isRequired,
  setPart: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  setZoom: PropTypes.func.isRequired,
  size: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired,
  totalFrames: PropTypes.number.isRequired,
};

export default ScreenExport;
