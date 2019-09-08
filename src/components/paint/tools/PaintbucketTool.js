import React from "react";
import PropTypes from "prop-types";
import PaletteContainer from "../../containers/PaletteContainer";
import { ColorswatchPicker } from "../../common";

const PaintbucketTool = props => {
  return (
    <div id="PaintBucket-Tool" className="ToolComponent">
      <i
        className="icon flaticon-paint2"
        style={{ position: "relative", left: "-0.2em" }}
      />
      <ColorswatchPicker color={props.color} action={props.brushColor} />
      <span className="spacer" />
      <div className="palette">
        <PaletteContainer />
      </div>
    </div>
  );
};

PaintbucketTool.propTypes = {
  color: PropTypes.string.isRequired,
  brushColor: PropTypes.func.isRequired,
};

export default PaintbucketTool;
