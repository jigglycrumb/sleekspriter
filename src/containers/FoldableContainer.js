import React from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import FrameboxContainer from "./FrameboxContainer";
import LayerboxContainer from "./LayerboxContainer";
import PreviewboxContainer from "./PreviewboxContainer";

const components = {
  FrameboxContainer,
  LayerboxContainer,
  PreviewboxContainer,
};

import {
  boxFold
} from "../state/actions";

const mapStateToProps = (state) => {
  return {
    folds: state.ui.paint.fold,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    boxFold: (box) => dispatch(boxFold(box)),
  };
};

const FoldableContainer = (props) => {
  const
    folded = props.folds[props.fold],
    FoldComponent = components[props.component],
    handleClasses = classnames({
      "foldable-handle": true,
      folded,
    }),
    innerBox = folded === true
             ? null
             : <div className="foldable-fold">
                 <FoldComponent {...props} />
               </div>;

  return (
    <div id={props.id} className="box">
      <h4 className={handleClasses} onClick={props.boxFold.bind(this, props.fold)}>{props.title}</h4>
      {innerBox}
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoldableContainer);
