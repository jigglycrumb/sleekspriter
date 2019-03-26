import React from "react";

import FoldableBox from "../containers/FoldableBox";
import PreviewboxContainer from "../containers/PreviewboxContainer";
import FrameboxContainer from "../containers/FrameboxContainer";
import LayerboxContainer from "../containers/LayerboxContainer";
import StatusbarContainer from "../containers/StatusbarContainer";
import ToolboxContainer from "../containers/ToolboxContainer";
import ToolContainer from "../containers/ToolContainer";
import StageboxContainer from "../containers/StageboxContainer";
import ReferenceImage from "../paint/ReferenceImage";
import SelectionPattern from "../paint/SelectionPattern";
import { t } from "../../utils";

class ScreenPaint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      referenceImage: null,
      referenceImageDataURL: null,
    };

    this.handleDrop = this.handleDrop.bind(this);
    this.removeReferenceImage = this.removeReferenceImage.bind(this);
    this.registerLayerCanvas = this.registerLayerCanvas.bind(this);

    this.layerCanvases = {};
  }

  render() {
    const framebox =
      this.props.totalFrames == 1 ? null : (
        <FoldableBox fold="frames" title={t("Frames")} id="FrameBox">
          <FrameboxContainer />
        </FoldableBox>
      );

    const referenceImage =
      this.state.referenceImageDataURL === null ? null : (
        <ReferenceImage
          image={this.state.referenceImage}
          imageData={this.state.referenceImageDataURL}
          removeHandler={this.removeReferenceImage}
        />
      );

    return (
      <section
        className="screen paint"
        onDragOver={this.cancel}
        onDrop={this.handleDrop}>
        <div className="area top">
          <ToolContainer />
        </div>
        <div className="area left">
          <ToolboxContainer />
          <SelectionPattern />
        </div>
        <div className="area center">
          <div>
            <StageboxContainer
              image={this.state.referenceImage === null ? false : true}
              externalLayerCanvases={this.layerCanvases}
            />
            {referenceImage}
          </div>
        </div>
        <div className="area right">
          <FoldableBox fold="preview" title={t("Preview")} id="PreviewBox">
            <PreviewboxContainer />
          </FoldableBox>
          {framebox}
          <FoldableBox fold="layers" title={t("Layers")} id="LayerBox">
            <LayerboxContainer registerLayerCanvas={this.registerLayerCanvas} />
          </FoldableBox>
        </div>
        <div className="area statusbar">
          <StatusbarContainer />
        </div>
      </section>
    );
  }

  removeReferenceImage() {
    this.setState({ referenceImage: null, referenceImageDataURL: null });
  }

  cancel(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDrop(e) {
    this.cancel(e);

    if (e.dataTransfer.files.length >= 1) {
      const self = this,
        file = e.dataTransfer.files[0],
        allowed = {
          "image/jpeg": true,
          "image/gif": true,
          "image/png": true,
        };

      if (file.type in allowed) {
        let reader = new FileReader();
        reader.onload = (function() {
          return function(e) {
            self.setState({
              referenceImage: file,
              referenceImageDataURL: e.target.result,
            });
          };
        })(file);

        reader.readAsDataURL(file);
      }
    }
  }

  registerLayerCanvas(layerId, canvas) {
    this.layerCanvases[layerId] = canvas;
  }
}

export default ScreenPaint;
