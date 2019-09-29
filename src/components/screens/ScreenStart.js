import React from "react";
import PropTypes from "prop-types";

import { t } from "../../utils";

class ScreenStart extends React.Component {
  constructor(props) {
    super(props);

    this.newFile = this.newFile.bind(this);
    this.openFile = this.openFile.bind(this);
  }

  render() {
    return (
      <section className="screen start">
        <div className="splash">
          <div className="inner">
            <div className="logo">{APPNAME}</div>
            <ul>
              <li>
                <a onClick={this.newFile}>{t("New file")}</a>
              </li>
              <li>
                <a onClick={this.openFile}>{t("Open file")}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="area statusbar">
          <div className="bar">{VERSION}</div>
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

ScreenStart.propTypes = {
  modalShow: PropTypes.func.isRequired,
};

export default ScreenStart;
