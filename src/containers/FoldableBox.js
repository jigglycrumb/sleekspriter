import React from "react";
import classnames from "classnames";
import { connect } from "react-redux";

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

const FoldableBox = (props) => {
  const
    folded = props.folds[props.fold],
    handleClasses = classnames({
      "foldable-handle": true,
      folded,
    }),
    innerBox = folded === true
             ? null
             : <div className="foldable-fold">
                 {props.children}
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
)(FoldableBox);
