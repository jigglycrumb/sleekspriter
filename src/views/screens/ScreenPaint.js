import React from "react";

import FrameboxContainer from "../../containers/FrameboxContainer";
import LayerboxContainer from "../../containers/LayerboxContainer";
import StatusbarContainer from "../../containers/StatusbarContainer";
import ToolboxContainer from "../../containers/ToolboxContainer";
import ToolContainer from "../../containers/ToolContainer";

import FoldableContainer from "../../containers/FoldableContainer";

const ScreenPaint = () => {
  return (
    <section className="screen paint">
      <div className="area top">
        <ToolContainer />
      </div>
      <div className="area left">
        <ToolboxContainer />
      </div>
      <div className="area center">
        {/*<StageBox image={this.state.referenceImage} file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} />*/}
        {/*referenceImage*/}
      </div>
      <div className="area right">
        <div id="layerboxhelper">
          {/*<PreviewBox file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} fold="preview" />*/}
          {/*frameBox*/}
          <FoldableContainer component="FrameboxContainer" fold="frames" title="Frames" id="FrameBox" />
        </div>
        <FoldableContainer component="LayerboxContainer" fold="layers" title="Layers" id="LayerBox" />
      </div>
      <div className="area statusbar">
        <StatusbarContainer />
      </div>
    </section>
  );
};

export default ScreenPaint;
