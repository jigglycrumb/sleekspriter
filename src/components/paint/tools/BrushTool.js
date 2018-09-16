import React from "react";
import PaletteContainer from "../../containers/PaletteContainer";
import { ColorswatchPicker } from "../../common";

class BrushTool extends React.Component {
  render() {
    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon flaticon-small23" />
        <ColorswatchPicker
          color={this.props.color}
          action={this.props.brushColor}
        />
        <span className="spacer" />
        <div className="palette">
          <PaletteContainer />
        </div>
      </div>
    );
  }
}

export default BrushTool;
