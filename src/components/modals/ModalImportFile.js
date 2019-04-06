import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { t, fileToState } from "../../utils";
import { modalHide, fileLoad } from "../../state/actions";
import { GridCanvas } from "../canvases";
import importWorker from "../../workers/import";

const mapDispatchToProps = dispatch => ({
  hide: () => dispatch(modalHide()),
  load: json => dispatch(fileLoad(json)),
});

class ModalImportFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: {
        width: 0,
        height: 0,
        name: null,
        data: null,
      },
      frames: {
        x: 1,
        y: 1,
      },
    };

    this.updateFrames = this.updateFrames.bind(this);
    this.cancel = this.cancel.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.import = this.import.bind(this);
  }

  componentWillMount() {
    this.worker = new importWorker();

    this.worker.onmessage = m => {
      // worker returns JSON like a saved *.pixels file,
      // so we'll treat it like a regular file load
      this.props.load(fileToState(m.data));
      this.props.hide();
      document.getElementById("ScreenBlocker").style.display = "none";
    };

    this.worker.onfail = e => {
      console.error(
        `Worker failed in line ${e.lineno} with message: ${e.message}`
      );
      document.getElementById("ScreenBlocker").style.display = "none";
    };
  }

  render() {
    let okButtonDisabled = true;
    let imageDropZone = <h3>{t("Drop image here")}</h3>;
    let frameSettings = null;

    if (this.state.image.data !== null) {
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

      imageDropZone = (
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
      );

      frameSettings = (
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
      );
    }

    return (
      <div className="dialog">
        <div className="title">{t("Import file")}</div>
        <div className="text">
          <div
            className="new-file-preview"
            onDragOver={this.cancel}
            onDrop={this.handleDrop}>
            {imageDropZone}
          </div>
          {frameSettings}
        </div>
        <div className="actions">
          <button onClick={this.import} disabled={okButtonDisabled}>
            {t("Ok")}
          </button>
          <button onClick={this.props.hide}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }

  cancel(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDrop(e) {
    this.cancel(e);

    if (e.dataTransfer.files.length >= 1) {
      const file = e.dataTransfer.files[0];
      const self = this;
      const allowed = {
        "image/jpeg": true,
        "image/gif": true,
        "image/png": true,
      };

      if (file.type in allowed) {
        const reader = new FileReader();
        reader.onload = (function() {
          return function(e) {
            const data = e.target.result;
            let dummy = document.createElement("img");
            dummy.src = data;
            dummy.onload = () => {
              // remove file name extension
              let fileName = file.name.split(".");
              fileName.pop();
              fileName = fileName.join(".");

              self.setState({
                image: {
                  width: dummy.naturalWidth,
                  height: dummy.naturalHeight,
                  name: fileName,
                  data: data,
                },
              });
            };
          };
        })(file);
        reader.readAsDataURL(file);
      }
    }
  }

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
  hide: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(ModalImportFile);
