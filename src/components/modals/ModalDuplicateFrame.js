import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";

import { t, createNewLayerId } from "../../utils";
import {
  getFileLayers,
  getFrameLayersZSorted,
  getTotalFrames,
} from "../../state/selectors";
import { frameDuplicate, modalHide } from "../../state/actions";

const mapStateToProps = state => ({
  frame: state.ui.paint.frame,
  nextLayerId: createNewLayerId(getFileLayers(state)),
  layers: getFrameLayersZSorted(state),
  totalFrames: getTotalFrames(state),
});

const mapDispatchToProps = dispatch => ({
  frameDuplicate: (layers, source, target, nextLayerId) =>
    dispatch(frameDuplicate(layers, source, target, nextLayerId)),
  hide: () => dispatch(modalHide()),
});

class ModalDuplicateFrame extends React.Component {
  state = {
    source: this.props.frame,
    target: 1,
    error: true,
  };

  render() {
    const { error } = this.state;
    const inputClasses = classnames({ error });

    return (
      <div className="dialog">
        <div className="title">{t("Duplicate frame")}</div>
        <div className="text">
          {t("Copy a frame with its layers to another frame.")}
          <br />
          {t("The target frame will be replaced.")}
          <ul>
            <li>
              <label>{t("Source")}</label>
              <input
                type="number"
                className={inputClasses}
                ref={node => (this.source = node)}
                value={this.state.source}
                min="1"
                max={this.props.totalFrames}
                onChange={() => this.updateForm()}
              />
            </li>
            <li>
              <label>{t("Target")}</label>
              <input
                type="number"
                className={inputClasses}
                ref={node => (this.target = node)}
                value={this.state.target}
                min="1"
                max={this.props.totalFrames}
                onChange={() => this.updateForm()}
              />
            </li>
          </ul>
        </div>
        <div className="actions">
          <button
            onClick={() => this.duplicateFrame()}
            disabled={this.state.error}>
            {t("Ok")}
          </button>
          <button onClick={this.props.hide}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }

  updateForm() {
    const source = +this.source.value;
    const target = +this.target.value;
    const error = source === target;

    this.setState({ source, target, error });
  }

  duplicateFrame() {
    if (this.state.source !== this.state.target) {
      this.props.frameDuplicate(
        this.props.layers,
        this.state.source,
        this.state.target,
        this.props.nextLayerId
      );
    }
    this.props.hide();
  }
}

ModalDuplicateFrame.propTypes = {
  frame: PropTypes.number.isRequired,
  frameDuplicate: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  nextLayerId: PropTypes.number.isRequired,
  totalFrames: PropTypes.number.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalDuplicateFrame);
