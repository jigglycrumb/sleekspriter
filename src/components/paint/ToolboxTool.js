import React from "react";
import PropTypes from "prop-types";

const ToolboxTool = props => {
  let cssClasses = "ToolBoxTool transparent";
  if (props.selected) cssClasses += " active";

  return (
    <button
      id={props.id}
      className={cssClasses}
      disabled={props.selected}
      title={props.title}
      onClick={props.toolSelect.bind(this, props.id)}>
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
