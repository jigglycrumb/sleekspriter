import React from "react";
import { connect } from "react-redux";
import { t } from "../../utils";
import { getTotalFrames } from "../../state/selectors";
import {
  frameDuplicate,
  modalHide
} from "../../state/actions";

const mapStateToProps = (state) => ({
  frame: state.ui.paint.frame,
  totalFrames: getTotalFrames(state),
});

const mapDispatchToProps = (dispatch) => ({
  frameDuplicate: (source, target) => dispatch(frameDuplicate(source, target)),
  hide: () => dispatch(modalHide()),
});

class ModalDuplicateFrame extends React.Component {

  state = {
    source: this.props.frame,
    target: 1
  };

  render() {
    return (
      <div className="dialog">
        <div className="title">{t("Duplicate frame")}</div>
        <div className="text">
          {t("Copy a frame with its layers to another frame.")}<br />
          {t("The target frame will be replaced.")}
          <ul>
            <li>
              <label>{t("Source")}</label>
              <input type="number" ref={(node) => this.source = node} value={this.state.source} min="1" max={this.props.totalFrames} onChange={() => this.updateForm()} />
            </li>
            <li>
              <label>{t("Target")}</label>
              <input type="number" ref={(node) => this.target = node} value={this.state.target} min="1" max={this.props.totalFrames} onChange={() => this.updateForm()} />
            </li>
          </ul>
        </div>
        <div className="actions">
          <button onClick={() => this.duplicateFrame()}>{t("Ok")}</button>
          <button onClick={this.props.hide}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }

  updateForm() {
    const
      source = +this.source.value,
      target = +this.target.value;

    this.setState({ source, target });
  }

  duplicateFrame() {
    if(this.state.source !== this.state.target) {
      this.props.frameDuplicate( this.state.source, this.state.target );
    }
    this.props.hide();
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalDuplicateFrame);
