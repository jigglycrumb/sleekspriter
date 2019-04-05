import React from "react";
import { connect } from "react-redux";
import { t } from "../../utils";
import { modalHide } from "../../state/actions";

const mapDispatchToProps = dispatch => ({
  hide: () => dispatch(modalHide()),
});

function ModalErrorInvisibleLayer(props) {
  return (
    <div className="dialog">
      <div className="title">{t("Error")}</div>
      <div className="text">
        {t("Cannot change an invisible or completely transparent layer.")}
      </div>
      <div className="actions">
        <button onClick={props.hide}>{t("Ok")}</button>
      </div>
    </div>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(ModalErrorInvisibleLayer);
