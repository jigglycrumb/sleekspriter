import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { t } from "../../utils";
import { modalHide } from "../../state/actions";

const mapDispatchToProps = { modalHide };

const ModalErrorInvisibleLayer = props => {
  return (
    <div className="dialog">
      <div className="title">{t("Error")}</div>
      <div className="text">
        {t("Cannot change an invisible or completely transparent layer.")}
      </div>
      <div className="actions">
        <button onClick={props.modalHide}>{t("Ok")}</button>
      </div>
    </div>
  );
};

ModalErrorInvisibleLayer.propTypes = {
  modalHide: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(ModalErrorInvisibleLayer);
