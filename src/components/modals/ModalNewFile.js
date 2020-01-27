import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import config from "../../config";

import {
  modalHide,
  fileCreate,
  screenSelect,
  zoomFit,
} from "../../state/actions";

import { GridCanvas } from "../canvases";

const { limits } = config;

const mapDispatchToProps = {
  modalHide,
  fileCreate,
  screenSelect,
  zoomFit,
};

class ModalNewFile extends React.Component {
  state = {
    frames: {
      x: 1,
      y: 1,
    },
    size: {
      width: 16,
      height: 16,
    },
  };

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
                value={this.state.frames.x}
                min={1}
                max={limits.file.frames.x}
                onChange={e => this.handleChange("frames", "x", e.target.value)}
              />
              x
              <input
                type="number"
                value={this.state.frames.y}
                min={1}
                max={limits.file.frames.y}
                onChange={e => this.handleChange("frames", "y", e.target.value)}
              />
            </li>
            <li>
              <label>Frame size:</label>
              <input
                type="number"
                value={this.state.size.width}
                min={1}
                max={limits.file.frameSize}
                onChange={e =>
                  this.handleChange("size", "width", e.target.value)
                }
              />
              x
              <input
                type="number"
                value={this.state.size.height}
                min={1}
                max={limits.file.frameSize}
                onChange={e =>
                  this.handleChange("size", "height", e.target.value)
                }
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
          <button onClick={this.handleFileCreate}>Ok</button>
          <button onClick={this.props.modalHide}>Cancel</button>
        </div>
      </div>
    );
  }

  handleChange(prop, dimension, value) {
    const max = limits.file[prop][dimension];
    if (value > max) {
      value = max;
    } else if (value < 1) {
      value = 1;
    }

    const state = {
      ...this.state,
      [prop]: {
        ...this.state[prop],
        [dimension]: +value,
      },
    };

    this.setState(state);
  }

  handleFileCreate = () => {
    this.props.fileCreate(this.state.frames, this.state.size);
    this.props.modalHide();
    this.props.screenSelect("paint");
    this.props.zoomFit(this.state.size);
  };
}

ModalNewFile.propTypes = {
  fileCreate: PropTypes.func.isRequired,
  modalHide: PropTypes.func.isRequired,
  screenSelect: PropTypes.func.isRequired,
  zoomFit: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(ModalNewFile);
