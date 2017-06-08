import React from "react";
import { connect } from "react-redux";
import ToolboxTool from "../views/paint/ToolboxTool";

import { toolSelect } from "../state/actions";

const mapStateToProps = (state) => {
  return {
    tool: state.ui.paint.tool
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toolSelect: (tool) => dispatch(toolSelect(tool))
  };
};


class ToolboxContainer extends React.Component {
  render() {

    const tools= [
      { id: "BrushTool", icon: "flaticon-small23" },
      { id: "EraserTool", icon: "flaticon-double31" },
      { id: "EyedropperTool", icon: "flaticon-eyedropper2" },
      { id: "RectangularSelectionTool", icon: "flaticon-selection7" },
      { id: "PaintBucketTool", icon: "flaticon-paint2" },
      { id: "BrightnessTool", icon: "flaticon-sun4" },
      { id: "MoveTool", icon: "flaticon-move11" },
      { id: "ZoomTool", icon: "flaticon-magnifier5" },
    ];

    return (
      <div id="ToolBox">
        <h4>Tools</h4>
        <div>
          {tools.map(function(tool) {
            return <ToolboxTool
                      key={tool.id}
                      id={tool.id}
                      icon={tool.icon}
                      selected={tool.id === this.props.tool}
                      toolSelect={this.props.toolSelect} />;
          }, this)}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolboxContainer);
