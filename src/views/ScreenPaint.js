import React from 'react';

import ToolContainer from '../containers/ToolContainer';
import ToolboxContainer from '../containers/ToolboxContainer';

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
      </div>
      <div className="area statusbar">
        {/*<StatusBar ui={this.props.ui} pixels={this.props.pixels} />*/}
      </div>
    </section>
  );
};

export default ScreenPaint;
