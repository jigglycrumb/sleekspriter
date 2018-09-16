import React from "react";
import PaletteContainer from "../../containers/PaletteContainer";
import { ColorswatchPicker } from "../../common";

class PaintbucketTool extends React.Component {
  render() {
    return (
      <div id="PaintBucket-Tool" className="ToolComponent">
        <i
          className="icon flaticon-paint2"
          style={{ position: "relative", left: "-0.2em" }}
        />
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

export default PaintbucketTool;
