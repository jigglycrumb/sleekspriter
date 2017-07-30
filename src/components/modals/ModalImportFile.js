import React from "react";
import { connect } from "react-redux";
import { t } from "../../utils";
import {
  modalHide
} from "../../state/actions";
import { GridCanvas } from "../canvases";
import importWorker from "worker-loader!../../workers/import";

const mapDispatchToProps = (dispatch) => ({
  hide: () => dispatch(modalHide()),
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
  }

  componentWillMount() {
    this.worker = new importWorker();

    this.worker.onmessage = (m) => {
      // utils.loadFileFromJSON(self.state.image.name, self.state.image.folder, e.data);

      console.log("worker done", m.data);
      this.props.hide();
      document.getElementById("ScreenBlocker").style.display = "none";
    };

    this.worker.onfail = (e) => {
      console.error(`worker failed in line ${e.lineno} with message: ${e.message}`);
      document.getElementById("ScreenBlocker").style.display = "none";
    };
  }

  render() {

    let
      okButtonDisabled = true,
      imageDropZone = <h3>Drop image here</h3>,
      frameSettings = null;

    if(this.state.image.data !== null) {
      const wrapperCss = {
        width: this.state.image.width,
        height: this.state.image.height
      };

      const
        s = this.calculateFrameSize(),
        frameWidth = s.width,
        frameHeight = s.height,
        validation = this.validateFrameSize();

      let frameSize;

      if(validation.allValid) {
        okButtonDisabled = false;
        frameSize = <span>{frameWidth} x {frameHeight} px</span>;
      }
      else {
        const
          w = validation.widthValid ? frameWidth : <span className="error">{frameWidth.toFixed(1)}</span>,
          h = validation.heightValid ? frameHeight : <span className="error">{frameHeight.toFixed(1)}</span>;

        frameSize = <span>{w} x {h} px</span>;
      }

      imageDropZone = <div>
                  <div className="image-import-dropzone-wrapper" style={wrapperCss}>
                    <img src={this.state.image.data} title={this.state.image.name} ref="importImage" />
                    <GridCanvas
                      width={this.state.image.width}
                      height={this.state.image.height}
                      columns={this.state.frames.x}
                      rows={this.state.frames.y} />
                  </div>
                </div>;

      frameSettings =   <ul>
                          <li>
                            <label>Frames:</label>
                            <input type="number" ref="framesX" value={this.state.frames.x} min="1" onChange={::this.updateFrames} />
                            x
                            <input type="number" ref="framesY" value={this.state.frames.y} min="1" onChange={::this.updateFrames} />
                          </li>
                          <li>
                            <label>Frame size:</label> {frameSize}
                          </li>
                        </ul>;
    }

    return (
      <div className="dialog">
        <div className="title">{t("Import file")}</div>
        <div className="text">
          <div className="new-file-preview" onDragOver={::this.cancel} onDrop={::this.handleDrop}>
            {imageDropZone}
          </div>
          {frameSettings}
        </div>
        <div className="actions">
          <button onClick={::this.import} disabled={okButtonDisabled}>{t("Ok")}</button>
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

    if(e.dataTransfer.files.length >= 1) {
      const
        file = e.dataTransfer.files[0],
        self = this,
        allowed = {
          "image/jpeg": true,
          "image/gif": true,
          "image/png": true,
        };

      if(file.type in allowed) {
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
                }
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
      width: this.state.image.width/this.state.frames.x,
      height: this.state.image.height/this.state.frames.y
    };
  }

  validateFrameSize() {
    const
      s = this.calculateFrameSize(),
      widthValid = s.width === parseInt(s.width, 10),
      heightValid = s.height === parseInt(s.height, 10);

    return {
      widthValid: widthValid,
      heightValid: heightValid,
      allValid: widthValid && heightValid
    };
  }

  updateFrames() {
    this.setState({
      frames: {
        x: +this.refs.framesX.value,
        y: +this.refs.framesY.value,
      }
    });
  }

  import() {
    console.log("Starting import");

    if(this.validateFrameSize().allValid) {
      document.getElementById("ScreenBlocker").style.display = "block";

      // create canvas element
      const
        canvas = document.createElement("canvas"),
        ctx    = canvas.getContext("2d"),
        image    = this.refs.importImage;

      canvas.width = image.width;
      canvas.height = image.height;

      // copy dropped image to canvas
      ctx.drawImage(image, 0, 0);

      // get pixel data
      const
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
        frameSize = this.calculateFrameSize(),
        data = {
          frameSize: frameSize,
          imageData: imageData,
          state: this.state,
          imageDimensions: {
            width: image.width,
            height: image.height
          },
        };

      this.worker.postMessage(data);
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ModalImportFile);
