import React from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import FrameboxContainer from "./FrameboxContainer";
import LayerboxContainer from "./LayerboxContainer";

import {
  foldBox
} from "../state/actions";

const mapStateToProps = (state) => {
  return {
    folds: state.ui.paint.fold,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    foldBox: (box) => dispatch(foldBox(box)),
  };
};

const components = {
  FrameboxContainer,
  LayerboxContainer,
};

class FoldableContainer extends React.Component {
  render() {
    const FoldComponent = components[this.props.component];

    let
      handleClasses = { "foldable-handle": true },
      boxStyle = { display: "block" };

    if(this.props.folds[this.props.fold] === true) {
      handleClasses["folded"] = true;
      boxStyle.display = "none";
    }

    return (
      <div id={this.props.id} className="box">
        <h4 className={classnames(handleClasses)} onClick={::this.fold}>{this.props.title}</h4>
        <div className="foldable-fold" style={boxStyle}>
          <FoldComponent {...this.props} />
        </div>
      </div>
    );
  }

  fold() {
    this.props.foldBox(this.props.fold);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoldableContainer);
