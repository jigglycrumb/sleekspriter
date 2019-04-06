import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { t, fileToState } from "../../../utils";
import { fileLoad, modalHide, zoomFit } from "../../../state/actions";
import { getFrameLayersZSorted } from "../../../state/selectors";
import { AES, enc } from "crypto-js";
import config from "../../../config";
const { fileEncryptionSecret } = config;

const mapStateToProps = state => ({
  layers: getFrameLayersZSorted(state),
});

const mapDispatchToProps = dispatch => ({
  hide: () => dispatch(modalHide()),
  load: json => dispatch(fileLoad(json)),
  zoomFit: size => dispatch(zoomFit(size)),
});

class ModalLoadFile extends React.Component {
  constructor(props) {
    super(props);
    this.loadFile = this.loadFile.bind(this);
  }

  render() {
    return (
      <div className="dialog">
        <div className="title">{t("Open file")}</div>
        <div className="text">
          {t("Paste the contents of your last save here")}
        </div>
        <textarea
          className="json-input"
          ref={n => (this.jsonInput = n)}
          autoFocus
        />
        <div className="actions">
          <button onClick={this.loadFile}>{t("Open")}</button>
          <button onClick={this.props.hide}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }

  loadFile() {
    const input = this.jsonInput.value.toString();
    let json = false;

    try {
      json = JSON.parse(input);
    } catch (e) {
      try {
        const bytes = AES.decrypt(input, fileEncryptionSecret);
        json = JSON.parse(bytes.toString(enc.Utf8));
      } catch (e) {
        console.error("Invalid file");
      }
    }

    if (json) {
      const state = fileToState(json);
      this.props.load(state);
      this.props.hide();
      this.props.zoomFit(state.size);
    } else {
      this.jsonInput.focus();
    }
  }
}

ModalLoadFile.propTypes = {
  hide: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
  zoomFit: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalLoadFile);
