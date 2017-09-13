import React from "react";

import { t } from "../../utils";

const ExportPartSelection = () => <div>ExportPartSelection</div>;
const ExportZoomSelection = () => <div>ExportZoomSelection</div>;
const ExportOutputSelection = () => <div>ExportOutputSelection</div>;
const ExportButton = () => <div>ExportButton</div>;
const ExportPreviewBox = () => <div>ExportPreviewBox</div>;
const ExportStatus = () => <div>ExportStatus</div>;

class ScreenExport extends React.Component {
  render() {
    const partSelection = this.props.totalFrames === 1
                        ? null
                        : <ExportPartSelection />;

    return (
      <section className="screen export">
        <div className="area left">
          <h5>{t("Settings")}</h5>
          {partSelection}
          <ExportZoomSelection />
          <ExportOutputSelection />
          <ExportButton />
        </div>

        <div className="area right">
          <ExportPreviewBox />
        </div>

        <div className="area statusbar">
          <ExportStatus />
        </div>
      </section>
    );
  }
}

export default ScreenExport;
