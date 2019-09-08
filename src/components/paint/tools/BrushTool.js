import React from "react";
import PropTypes from "prop-types";
import PaletteContainer from "../../containers/PaletteContainer";
import { ColorswatchPicker } from "../../common";

const BrushTool = props => {
  return (
    <div id="Brush-Tool" className="ToolComponent">
      <i className="icon flaticon-small23" />
      <ColorswatchPicker color={props.color} action={props.brushColor} />
      <span className="spacer" />
      <div className="palette">
        <PaletteContainer />
      </div>
    </div>
  );
};

BrushTool.propTypes = {
  color: PropTypes.string.isRequired,
  brushColor: PropTypes.func.isRequired,
};

export default BrushTool;
