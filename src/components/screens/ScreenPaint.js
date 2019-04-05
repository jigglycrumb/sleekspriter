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
      layerCanvases: {},
      previewCanvas: null,
    };

    this.handleDrop = this.handleDrop.bind(this);
    this.removeReferenceImage = this.removeReferenceImage.bind(this);
    this.registerLayerCanvas = this.registerLayerCanvas.bind(this);
    this.registerPreviewCanvas = this.registerPreviewCanvas.bind(this);
    this.registerFrameCanvas = this.registerFrameCanvas.bind(this);

    this.layerCanvases = {};
    this.frameCanvases = {};
    // this.previewCanvas = null;
  }

  render() {
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
              image={this.state.referenceImage !== null}
              externalLayerCanvases={this.layerCanvases}
              externalPreviewCanvas={this.state.previewCanvas}
              externalFrameCanvases={this.frameCanvases}
            />
            {this.state.referenceImageDataURL && (
              <ReferenceImage
                image={this.state.referenceImage}
                imageData={this.state.referenceImageDataURL}
                removeHandler={this.removeReferenceImage}
              />
            )}
          </div>
        </div>
        <div className="area right">
          <FoldableBox fold="preview" title={t("Preview")} id="PreviewBox">
            <PreviewboxContainer
              registerPreviewCanvas={this.registerPreviewCanvas}
            />
          </FoldableBox>
          {this.props.totalFrames > 1 && (
            <FoldableBox fold="frames" title={t("Frames")} id="FrameBox">
              <FrameboxContainer
                registerFrameCanvas={this.registerFrameCanvas}
              />
            </FoldableBox>
          )}
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
    this.setState({
      referenceImage: undefined,
      referenceImageDataURL: undefined,
    });
  }

  cancel(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDrop(e) {
    this.cancel(e);

    if (e.dataTransfer.files.length >= 1) {
      const self = this;
      const file = e.dataTransfer.files[0];
      const allowed = {
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
    // console.log("layer reg", layerId, canvas);
    this.layerCanvases[layerId] = canvas;
  }

  registerFrameCanvas(frame, canvas) {
    // console.log("frame reg", frame, canvas);
    this.frameCanvases[frame] = canvas;
  }

  registerPreviewCanvas(canvas) {
    // console.log("preview reg", canvas);
    this.setState({
      previewCanvas: canvas,
    });
    // this.previewCanvas = canvas;
  }
}

export default ScreenPaint;
