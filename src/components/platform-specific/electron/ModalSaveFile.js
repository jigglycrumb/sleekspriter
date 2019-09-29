import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { remote } from "electron";

import { t } from "../../../utils"; // TODO translations
import { fileDirty, fileInfo, modalHide } from "../../../state/actions";

import { getFile, getFileData } from "../../../state/selectors";

import { fileDefaultPath, fileInfoFromPath, save } from "./utils";

const { dialog } = remote;

const mapStateToProps = state => ({
  data: getFileData(state),
  file: getFile(state),
});

const mapDispatchToProps = { fileDirty, fileInfo, modalHide };

class ModalSaveFile extends React.Component {
  componentDidMount() {
    const defaultPath = fileDefaultPath(this.props.file);

    const filePath = dialog.showSaveDialogSync({
      defaultPath,
      filters: [{ name: "Pixels", extensions: ["pixels"] }],
    });

    if (filePath) {
      const { fileName, folder } = fileInfoFromPath(filePath);

      save(filePath, this.props.data, this.handleError);

      this.props.fileDirty(false);
      this.props.fileInfo(folder, fileName);
    }

    this.props.modalHide();
  }

  render() {
    return null;
  }

  handleError = error => {
    this.props.modalHide();
    console.error(error);
  };
}

ModalSaveFile.propTypes = {
  data: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired,
  fileDirty: PropTypes.func.isRequired,
  fileInfo: PropTypes.func.isRequired,
  modalHide: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSaveFile);
