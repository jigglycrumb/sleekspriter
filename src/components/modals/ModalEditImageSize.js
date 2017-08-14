import React from "react";
import { connect } from "react-redux";
import { t } from "../../utils";
import { GridCanvas } from "../canvases";
import {
  fileSize,
  modalHide
} from "../../state/actions";

const mapStateToProps = (state) => ({
  frames: state.file.frames,
  size: state.file.size
});

const mapDispatchToProps = (dispatch) => ({
  hide: () => dispatch(modalHide()),
  fileSize: (frames, size) => dispatch(fileSize(frames, size)),
});

class ModalEditImageSize extends React.Component {

  state = {
    frames: this.props.frames,
    size: this.props.size,
  };

  render() {
    const
      fileType = this.state.frames.x * this.state.frames.y === 1 ? "Image" : "Spritesheet",
      wrapperCss = {
        width: this.state.size.width * this.state.frames.x,
        height: this.state.size.height * this.state.frames.y
      };

    return (
      <div className="dialog">
        <div className="title">Image size</div>
        <div className="text">

          <div className="new-file-preview">
            <div className="new-file-preview-headline">Layout preview</div>
            <div className="new-file-preview-content" style={wrapperCss}>
              <GridCanvas
                width={wrapperCss.width}
                height={wrapperCss.height}
                columns={this.state.frames.x}
                rows={this.state.frames.y} />
            </div>
          </div>

          <ul className="new-file-frame-size">
            <li>
              <label>Frames:</label>
              <input type="number" ref={(node) => this.framesX = node} value={this.state.frames.x} min="1" onChange={() => this.updateForm()} />
              x
              <input type="number" ref={(node) => this.framesY = node} value={this.state.frames.y} min="1" onChange={() => this.updateForm()} />
            </li>
            <li>
              <label>Frame size:</label>
              <input type="number" ref={(node) => this.pixelsX = node} value={this.state.size.width} min="1" onChange={() => this.updateForm()} />
              x
              <input type="number" ref={(node) => this.pixelsY = node} value={this.state.size.height} min="1" onChange={() => this.updateForm()} />
              px
            </li>
            <li>
              <i ref="size">{fileType} size: {wrapperCss.width}x{wrapperCss.height} pixels</i>
            </li>
          </ul>
        </div>
        <div className="actions">
          <button onClick={() => this.updateFile()}>Ok</button>
          <button onClick={this.props.hide}>Cancel</button>
        </div>
      </div>
    );
  }

  updateForm() {
    const state = {
      frames: {
        x: +this.framesX.value,
        y: +this.framesY.value,
      },
      size: {
        width: +this.pixelsX.value,
        height: +this.pixelsY.value,
      },
    };
    this.setState(state);
  }

  updateFile() {
    const { frames, size } = this.state;
    this.props.fileSize(frames, size);
    this.props.hide();
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalEditImageSize);
