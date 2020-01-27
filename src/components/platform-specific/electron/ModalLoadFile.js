import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { remote } from "electron";
import { readFile } from "fs";
import { AES, enc } from "crypto-js";

import config from "../../../config";
import { fileToState } from "../../../utils";
import {
  fileDirty,
  fileInfo,
  fileLoad,
  modalHide,
  screenSelect,
  zoomFit,
} from "../../../state/actions";
import { getScreen } from "../../../state/selectors";

import { fileInfoFromPath } from "./utils";

const { fileEncryptionSecret } = config;
const { dialog } = remote;

const mapStateToProps = state => ({
  screen: getScreen(state),
});

const mapDispatchToProps = {
  fileDirty,
  fileInfo,
  fileLoad,
  modalHide,
  screenSelect,
  zoomFit,
};

class ModalLoadFile extends React.Component {
  componentDidMount() {
    document.getElementById("ScreenBlocker").style.display = "block";

    const file = dialog.showOpenDialogSync({
      properties: ["openFile", "createDirectory", "promptToCreate"],
      defaultPath: "~",
      message: "Choose a .pixels file to open",
      filters: [{ name: "Pixels", extensions: ["pixels"] }],
    });

    if (file) {
      this.loadFile(file[0]);
    } else {
      this.props.modalHide();
      document.getElementById("ScreenBlocker").style.display = "none";
    }
  }

  render() {
    return null;
  }

  loadFile = fullPath => {
    readFile(fullPath, "utf8", (error, contents) => {
      if (error) {
        this.handleError(error);
        return;
      }

      let json;
      try {
        json = JSON.parse(contents);
      } catch (error) {
        try {
          const bytes = AES.decrypt(contents, fileEncryptionSecret);
          json = JSON.parse(bytes.toString(enc.Utf8));
        } catch (e) {
          this.handleError("Invalid file");
          return;
        }
      }

      const { fileName, folder } = fileInfoFromPath(fullPath);

      if (json) {
        const state = fileToState(json);
        this.props.fileDirty(false);
        this.props.fileInfo(folder, fileName);
        this.props.fileLoad(state);
        this.props.zoomFit(state.size);
      }

      this.props.modalHide();
      document.getElementById("ScreenBlocker").style.display = "none";

      if (this.props.screen === "start") {
        this.props.screenSelect("paint");
      }
    });
  };

  handleError = error => {
    this.props.modalHide();
    console.error(error);
    document.getElementById("ScreenBlocker").style.display = "none";
  };
}

ModalLoadFile.propTypes = {
  fileDirty: PropTypes.func.isRequired,
  fileInfo: PropTypes.func.isRequired,
  fileLoad: PropTypes.func.isRequired,
  modalHide: PropTypes.func.isRequired,
  screen: PropTypes.string.isRequired,
  screenSelect: PropTypes.func.isRequired,
  zoomFit: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalLoadFile);
