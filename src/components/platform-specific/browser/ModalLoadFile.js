import React from "react";
import { connect } from "react-redux";
import { t, fileToState } from "../../../utils";
import {
  modalHide,
  fileLoad
} from "../../../state/actions";
import { AES, enc } from "crypto-js";
import config from "../../../config";
const { fileEncryptionSecret } = config;

const mapDispatchToProps = (dispatch) => ({
  hide: () => dispatch(modalHide()),
  load: (json) => dispatch(fileLoad(json))
});

class ModalLoadFile extends React.Component {
  render() {
    return (
      <div className="dialog">
        <div className="title">{t("Open file")}</div>
        <div className="text">{t("Paste the contents of your last save here")}</div>
        <textarea className="json-input" ref="jsonInput" autoFocus></textarea>
        <div className="actions">
          <button onClick={::this.loadFile}>{t("Open")}</button>
          <button onClick={this.props.hide}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }

  loadFile() {
    const input = this.refs.jsonInput.value.toString();
    const bytes = AES.decrypt(input, fileEncryptionSecret);

    let json = false;
    try { json = JSON.parse(bytes.toString(enc.Utf8)); }
    catch(e) { console.warn("invalid file"); }

    if(json) {
      this.props.load(fileToState(json));
      this.props.hide();
    }
    else {
      this.refs.jsonInput.focus();
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ModalLoadFile);
