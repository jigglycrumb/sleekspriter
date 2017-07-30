import React from "react";
import { connect } from "react-redux";
import { t, stateToFile } from "../../../utils";
import {
  modalHide
} from "../../../state/actions";

const mapStateToProps = (state) => ({
  file: state.file
});

const mapDispatchToProps = (dispatch) => ({
  hide: () => dispatch(modalHide()),
});

class ModalSaveFile extends React.Component {
  componentDidMount() {
    this.refs.jsonInput.focus();
    this.refs.jsonInput.select();
  }

  render() {
    // TODO the textarea throws a warning, find a way of making it readonly and still allow select
    return (
      <div className="dialog">
        <div className="title">{t("Save file")}</div>
        <div className="text">{t("Please copy everything below to a .txt file")}</div>
        <textarea className="json-input" ref="jsonInput" value={JSON.stringify(stateToFile(this.props.file))}  autoFocus></textarea>
        <div className="actions">
          <button onClick={this.props.hide}>{t("Ok")}</button>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSaveFile);
