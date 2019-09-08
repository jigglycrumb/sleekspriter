import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const ToolboxTool = props => {
  const cssClasses = classnames({
    ToolBoxTool: true,
    transparent: true,
    active: props.selected,
  });

  return (
    <button
      id={props.id}
      className={cssClasses}
      disabled={props.selected}
      title={props.title}
      onClick={() => props.toolSelect(props.id)}>
      <i className={props.icon} />
    </button>
  );
};

ToolboxTool.propTypes = {
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  toolSelect: PropTypes.func.isRequired,
};

export default ToolboxTool;
