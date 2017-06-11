import React from "react";
import { connect } from "react-redux";
import ToolboxTool from "../paint/ToolboxTool";

import { toolSelect } from "../../state/actions";
import { t } from "../../utils";

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
      { id: "BrushTool", icon: "flaticon-small23", title: t("Brush Tool") },
      { id: "EraserTool", icon: "flaticon-double31", title: t("Eraser Tool") },
      { id: "EyedropperTool", icon: "flaticon-eyedropper2", title: t("Eyedropper Tool") },
      { id: "RectangularSelectionTool", icon: "flaticon-selection7", title: t("Selection Tool") },
      { id: "PaintBucketTool", icon: "flaticon-paint2", title: t("Paint Bucket Tool") },
      { id: "BrightnessTool", icon: "flaticon-sun4", title: t("Brightness Tool") },
      { id: "MoveTool", icon: "flaticon-move11", title: t("Move Tool") },
      { id: "ZoomTool", icon: "flaticon-magnifier5", title: t("Zoom Tool") },
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
                      title={tool.title}
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
