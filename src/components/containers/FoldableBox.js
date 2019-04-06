import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";

import { boxFold } from "../../state/actions";

import { getFold } from "../../state/selectors";

const mapStateToProps = state => ({
  folds: getFold(state),
});

const mapDispatchToProps = dispatch => ({
  boxFold: box => dispatch(boxFold(box)),
});

const FoldableBox = props => {
  const folded = props.folds[props.fold];
  const handleClasses = classnames({
    "foldable-handle": true,
    folded,
  });
  const innerBox =
    folded === true ? null : (
      <div className="foldable-fold">{props.children}</div>
    );

  return (
    <div id={props.id} className="box">
      <h4
        className={handleClasses}
        onClick={props.boxFold.bind(this, props.fold)}>
        {props.title}
      </h4>
      {innerBox}
    </div>
  );
};

FoldableBox.propTypes = {
  boxFold: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  fold: PropTypes.string.isRequired,
  folds: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoldableBox);
