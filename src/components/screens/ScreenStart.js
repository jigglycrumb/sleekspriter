import React from "react";
import PropTypes from "prop-types";

import { t } from "../../utils";

import logo from "../../assets/logo.png";

const ScreenStart = ({ modalShow }) => {
  return (
    <section className="screen start">
      <div className="splash">
        <div className="inner">
          <div className="logo">
            <img src={logo} alt={APPNAME} />
          </div>
          <ul>
            <li>
              <a onClick={() => modalShow("ModalNewFile")}>{t("New file")}</a>
            </li>
            <li>
              <a onClick={() => modalShow("ModalLoadFile")}>{t("Open file")}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="area statusbar">
        <div className="bar">{VERSION}</div>
      </div>
    </section>
  );
};

ScreenStart.propTypes = {
  modalShow: PropTypes.func.isRequired,
};

export default ScreenStart;
