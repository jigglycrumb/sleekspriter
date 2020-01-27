import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { t, stateToFile } from "../../../utils";
import { getFileData } from "../../../state/selectors";
import { fileSave, modalHide } from "../../../state/actions";
import { AES } from "crypto-js";
import config from "../../../config";
const { fileEncryptionSecret } = config;

const mapStateToProps = state => ({
  file: getFileData(state),
});

const mapDispatchToProps = { fileSave, modalHide };

class ModalSaveFile extends React.Component {
  componentDidMount() {
    this.jsonInput.focus();
    this.jsonInput.select();
    this.props.fileSave();
  }

  render() {
    // TODO the textarea throws a warning, find a way of making it readonly and still allow select
    return (
      <div className="dialog">
        <div className="title">{t("Save file")}</div>
        <div className="text">
          {t("Please copy everything below to a .txt file")}
        </div>
        <textarea
          className="json-input"
          ref={n => (this.jsonInput = n)}
          onChange={() => {}}
          value={AES.encrypt(
            JSON.stringify(stateToFile(this.props.file)),
            fileEncryptionSecret
          )}
          autoFocus
        />
        <div className="actions">
          <button onClick={this.props.modalHide}>{t("Ok")}</button>
        </div>
      </div>
    );
  }
}

ModalSaveFile.propTypes = {
  file: PropTypes.object.isRequired,
  fileSave: PropTypes.func.isRequired,
  modalHide: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalSaveFile);
