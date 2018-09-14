import React from "react";
import { t } from "../../utils";

import ExportButton from "../export/ExportButton";
import ExportOutputSelection from "../export/ExportOutputSelection";
import ExportPartSelection from "../export/ExportPartSelection";
import ExportPreviewbox from "../export/ExportPreviewbox";
import ExportZoomSelection from "../export/ExportZoomSelection";
import ExportStatus from "../export/ExportStatus";

class ScreenExport extends React.Component {
  render() {
    const {
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
            <ExportOutputSelection
              format={format}
              part={part}
              setFormat={this.props.setFormat}
            />
            <ExportButton export={() => this.export()} />
          </div>
        </div>

        <div className="area right">
          <ExportPreviewbox
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
    const { format } = this.props,
      canvas = document
        .getElementById("ExportPreview")
        .querySelectorAll("canvas")[0],
      img = canvas.toDataURL(`image/${format}`),
      downloadLink = document.createElement("a");

    downloadLink.href = img;
    downloadLink.download = `my-pixels.${format === "jpeg" ? "jpg" : format}`; // TODO name file?

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    this.props.setStatus(t("Export finished"));
  }
}

export default ScreenExport;
