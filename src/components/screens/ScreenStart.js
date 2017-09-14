import React from "react";
import { t } from "../../utils";

class ScreenStart extends React.Component {
  render() {
    return (
      <section className="screen start">
        <div className="splash">
          <div className="inner">
            <div className="logo">@@name</div>
            <ul>
              <li><a onClick={::this.newFile}>{t("New file")}</a></li>
              <li><a onClick={::this.openFile}>{t("Open file")}</a></li>
            </ul>
          </div>
        </div>
        <div className="area statusbar">
          <div className="bar">@@version</div>
        </div>
      </section>
    );
  }

  newFile() {
    this.props.modalShow("ModalNewFile");
  }

  openFile() {
    this.props.modalShow("ModalLoadFile");
  }
}

export default ScreenStart;
