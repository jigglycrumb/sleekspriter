import React from "react";

import FoldableContainer from "../../containers/FoldableContainer";
import StatusbarContainer from "../../containers/StatusbarContainer";
import ToolboxContainer from "../../containers/ToolboxContainer";
import ToolContainer from "../../containers/ToolContainer";
import StageboxContainer from "../../containers/StageboxContainer";
import { t } from "../../utils";

const ScreenPaint = (props) => {

  const framebox = props.totalFrames == 1
                 ? null
                 : <FoldableContainer
                      component="FrameboxContainer"
                      fold="frames"
                      title={t("Frames")}
                      id="FrameBox" />;

  return (
    <section className="screen paint">
      <div className="area top">
        <ToolContainer />
      </div>
      <div className="area left">
        <ToolboxContainer />
      </div>
      <div className="area center">
        <StageboxContainer />
        {/*<StageBox image={this.state.referenceImage} file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} />*/}
        {/*referenceImage*/}
      </div>
      <div className="area right">
        <div id="layerboxhelper">
          <FoldableContainer component="PreviewboxContainer" fold="preview" title={t("Preview")} id="PreviewBox" />
          {framebox}
        </div>
        <FoldableContainer component="LayerboxContainer" fold="layers" title={t("Layers")} id="LayerBox" />
      </div>
      <div className="area statusbar">
        <StatusbarContainer />
      </div>
    </section>
  );
};

export default ScreenPaint;
