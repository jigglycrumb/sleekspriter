import React from "react";

import FoldableBox from "../../containers/FoldableBox";
import PreviewboxContainer from "../../containers/PreviewboxContainer";
import FrameboxContainer from "../../containers/FrameboxContainer";
import LayerboxContainer from "../../containers/LayerboxContainer";
import StatusbarContainer from "../../containers/StatusbarContainer";
import ToolboxContainer from "../../containers/ToolboxContainer";
import ToolContainer from "../../containers/ToolContainer";
import StageboxContainer from "../../containers/StageboxContainer";
import { t } from "../../utils";

const ScreenPaint = (props) => {

  const framebox = props.totalFrames == 1
                 ? null
                 : <FoldableBox fold="frames" title={t("Frames")} id="FrameBox">
                     <FrameboxContainer />
                   </FoldableBox>;

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
          <FoldableBox fold="preview" title={t("Preview")} id="PreviewBox">
            <PreviewboxContainer />
          </FoldableBox>
          {framebox}
        </div>
        <FoldableBox fold="layers" title={t("Layers")} id="LayerBox">
          <LayerboxContainer />
        </FoldableBox>
      </div>
      <div className="area statusbar">
        <StatusbarContainer />
      </div>
    </section>
  );
};

export default ScreenPaint;
