import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { remote } from "electron";
import { readFile } from "fs";
import imageType from "image-type";
import sizeOf from "image-size";

import { t, fileToState } from "../../../utils";
import {
  fileDirty,
  fileInfo,
  fileLoad,
  modalHide,
  zoomFit,
} from "../../../state/actions";
import { GridCanvas } from "../../canvases";
import ImportWorker from "../../../workers/import";

import { fileInfoFromPath } from "./utils";

const { dialog } = remote;

const mapDispatchToProps = {
  fileDirty,
  fileInfo,
  fileLoad,
  modalHide,
  zoomFit,
};

class ModalImportFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: {
        width: 0,
        height: 0,
        name: null,
        folder: null,
        data: null,
      },
      frames: {
        x: 1,
        y: 1,
      },
    };

    this.updateFrames = this.updateFrames.bind(this);
    this.import = this.import.bind(this);

    // setup worker
    this.worker = new ImportWorker();

    this.worker.onmessage = m => {
      // worker returns JSON like a saved *.pixels file,
      // so we'll treat it like a regular file load
      this.props.fileInfo(this.state.image.folder, this.state.image.name);
      this.props.fileDirty(false);
      this.props.fileLoad(fileToState(m.data));
      this.props.zoomFit({
        width: this.state.image.width,
        height: this.state.image.height,
      });
      this.props.modalHide();
      document.getElementById("ScreenBlocker").style.display = "none";
    };

    this.worker.onfail = e => {
      console.error(
        `Worker failed in line ${e.lineno} with message: ${e.message}`
      );
      document.getElementById("ScreenBlocker").style.display = "none";
    };
  }

  componentDidMount() {
    const file = dialog.showOpenDialogSync({
      properties: ["openFile", "createDirectory", "promptToCreate"],
      defaultPath: "~",
      message: "Choose an image to import",
      filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
    });

    if (file) {
      this.loadFile(file[0]);
    } else this.props.modalHide();
  }

  render() {
    if (this.state.image.data === null) return null;

    let okButtonDisabled = true;

    const wrapperCss = {
      width: this.state.image.width,
      height: this.state.image.height,
    };

    const s = this.calculateFrameSize();
    const frameWidth = s.width;
    const frameHeight = s.height;
    const validation = this.validateFrameSize();

    let frameSize;

    if (validation.allValid) {
      okButtonDisabled = false;
      frameSize = (
        <span>{t("${w} x ${h} px", { w: frameWidth, h: frameHeight })}</span>
      );
    } else {
      const w = validation.widthValid ? frameWidth : frameWidth.toFixed(1);
      const h = validation.heightValid ? frameHeight : frameHeight.toFixed(1);

      frameSize = (
        <span className="error">{t("${w} x ${h} px", { w, h })}</span>
      );
    }

    return (
      <div className="dialog">
        <div className="title">{t("Import file")}</div>
        <div className="text">
          <div className="new-file-preview">
            <div>
              <div className="image-import-dropzone-wrapper" style={wrapperCss}>
                <img
                  src={this.state.image.data}
                  title={this.state.image.name}
                  ref={n => (this.importImage = n)}
                />
                <GridCanvas
                  width={this.state.image.width}
                  height={this.state.image.height}
                  columns={this.state.frames.x}
                  rows={this.state.frames.y}
                />
              </div>
            </div>
          </div>
          <ul>
            <li>
              <label>{t("Frames")}</label>
              <input
                type="number"
                ref={n => (this.framesX = n)}
                value={this.state.frames.x}
                min="1"
                onChange={this.updateFrames}
              />
              x
              <input
                type="number"
                ref={n => (this.framesY = n)}
                value={this.state.frames.y}
                min="1"
                onChange={this.updateFrames}
              />
            </li>
            <li>
              <label>{t("Frame size")}</label> {frameSize}
            </li>
          </ul>
        </div>
        <div className="actions">
          <button onClick={this.import} disabled={okButtonDisabled}>
            {t("Ok")}
          </button>
          <button onClick={this.props.modalHide}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }

  loadFile = fullPath => {
    readFile(fullPath, (error, contents) => {
      if (error) {
        this.handleError(error);
        return;
      }

      const { fileName, folder } = fileInfoFromPath(fullPath);
      const { height, width } = sizeOf(contents);

      const type = imageType(contents);
      const blob = new Blob(contents, { type: type.mime });

      // convert binary data to base64 encoded string
      const base64file = Buffer.from(contents).toString("base64");
      const data = `data:${type.mime};base64,${base64file}`;

      const allowed = {
        "image/jpeg": true,
        "image/gif": true,
        "image/png": true,
      };

      if (blob.type in allowed) {
        let name = fileName.split(".");
        name.pop();
        name = name.join(".");

        this.setState({
          image: {
            width,
            height,
            name,
            folder,
            data,
          },
        });
      } else this.handleError("Invalid file");
    });
  };

  handleError = error => {
    this.props.modalHide();
    console.error(error);
  };

  calculateFrameSize() {
    return {
      width: this.state.image.width / this.state.frames.x,
      height: this.state.image.height / this.state.frames.y,
    };
  }

  validateFrameSize() {
    const s = this.calculateFrameSize();
    const widthValid = s.width === parseInt(s.width, 10);
    const heightValid = s.height === parseInt(s.height, 10);

    return {
      widthValid: widthValid,
      heightValid: heightValid,
      allValid: widthValid && heightValid,
    };
  }

  updateFrames() {
    this.setState({
      frames: {
        x: +this.framesX.value,
        y: +this.framesY.value,
      },
    });
  }

  import() {
    if (this.validateFrameSize().allValid) {
      document.getElementById("ScreenBlocker").style.display = "block";

      // create canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = this.importImage;

      canvas.width = image.width;
      canvas.height = image.height;

      // copy dropped image to canvas
      ctx.drawImage(image, 0, 0);

      // get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const frameSize = this.calculateFrameSize();
      const data = {
        frameSize: frameSize,
        imageData: imageData,
        state: this.state,
        imageDimensions: {
          width: image.width,
          height: image.height,
        },
      };

      this.worker.postMessage(data);
    }
  }
}

ModalImportFile.propTypes = {
  fileDirty: PropTypes.func.isRequired,
  fileInfo: PropTypes.func.isRequired,
  fileLoad: PropTypes.func.isRequired,
  modalHide: PropTypes.func.isRequired,
  zoomFit: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(ModalImportFile);
