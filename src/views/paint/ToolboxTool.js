import React from "react";

const ToolboxTool = (props) => {
  let cssClasses = "ToolBoxTool transparent";
  if(props.selected) cssClasses+= " active";

  return (
    <button
      id={props.id}
      className={cssClasses}
      disabled={props.selected}
      title={props.title}
      onClick={props.toolSelect.bind(this, props.id)}>
        <i className={props.icon}></i>
    </button>
  );
};

export default ToolboxTool;
