import React from "react";

import LayerboxContainer from "../../containers/LayerboxContainer";
import StatusbarContainer from "../../containers/StatusbarContainer";
import ToolboxContainer from "../../containers/ToolboxContainer";
import ToolContainer from "../../containers/ToolContainer";

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
        </div>
        {/*<LayerBox file={this.props.file} ui={this.props.ui} pixels={this.props.pixels} fold="layers" />*/}
        <LayerboxContainer />
      </div>
      <div className="area statusbar">
        <StatusbarContainer />
      </div>
    </section>
  );
};

export default ScreenPaint;
