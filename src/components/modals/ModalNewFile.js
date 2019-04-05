import React from "react";
import { connect } from "react-redux";
import {
  modalHide,
  fileCreate,
  screenSelect,
  zoomFit,
} from "../../state/actions";
import { GridCanvas } from "../canvases";
import initialState from "../../state/initialState";
const { frames, size } = initialState.file;

const mapDispatchToProps = dispatch => {
  return {
    hide: () => dispatch(modalHide()),
    fileCreate: (frames, pixels) => dispatch(fileCreate(frames, pixels)),
    screenSelect: screen => dispatch(screenSelect(screen)),
    zoomFit: size => dispatch(zoomFit(size)),
  };
};

class ModalNewFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frames: {
        x: 1,
        y: 1,
      },
      size: {
        width: 16,
        height: 16,
      },
    };

    this.updateState = this.updateState.bind(this);
    this.fileCreate = this.fileCreate.bind(this);
  }

  render() {
    var wrapperCss = {
      width: this.state.size.width * this.state.frames.x,
      height: this.state.size.height * this.state.frames.y,
    };

    var fileType =
      this.state.frames.x * this.state.frames.y === 1 ? "Image" : "Spritesheet";

    return (
      <div className="dialog">
        <div className="title">New file</div>
        <div className="text">
          <div className="new-file-preview">
            <div className="new-file-preview-headline">Layout preview</div>
            <div className="new-file-preview-content" style={wrapperCss}>
              <GridCanvas
                width={wrapperCss.width}
                height={wrapperCss.height}
                columns={+this.state.frames.x}
                rows={+this.state.frames.y}
              />
            </div>
          </div>

          <ul className="new-file-frame-size">
            <li>
              <label>Frames:</label>
              <input
                type="number"
                ref={n => (this.framesX = n)}
                value={this.state.frames.x}
                min="1"
                onChange={this.updateState}
              />
              x
              <input
                type="number"
                ref={n => (this.framesY = n)}
                value={this.state.frames.y}
                min="1"
                onChange={this.updateState}
              />
            </li>
            <li>
              <label>Frame size:</label>
              <input
                type="number"
                ref={n => (this.pixelsX = n)}
                value={this.state.size.width}
                min="1"
                onChange={this.updateState}
              />
              x
              <input
                type="number"
                ref={n => (this.pixelsY = n)}
                value={this.state.size.height}
                min="1"
                onChange={this.updateState}
              />
              px
            </li>
            <li>
              <i>
                {fileType} size: {this.state.frames.x * this.state.size.width}x
                {this.state.frames.y * this.state.size.height} pixels
              </i>
            </li>
          </ul>
        </div>
        <div className="actions">
          <button onClick={this.fileCreate}>Ok</button>
          <button onClick={this.props.hide}>Cancel</button>
        </div>
      </div>
    );
  }

  updateState() {
    var size = {
      frames: { x: +this.framesX.value, y: +this.framesY.value },
      size: { width: +this.pixelsX.value, height: +this.pixelsY.value },
    };
    this.setState(size);
  }

  fileCreate() {
    this.props.fileCreate(this.state.frames, this.state.size);
    this.props.hide();
    this.props.screenSelect("paint");
    this.props.zoomFit(this.state.size);
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ModalNewFile);
