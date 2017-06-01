import React from "react";
import classnames from "classnames";
import LayerboxLayer from "./LayerboxLayer";

class Layerbox extends React.Component {
  render() {
    let
      deleteButtonDisabled = this.props.layers.length <= 1, //this.props.layers.frame.length <= 1,
      handleClasses = { "foldable-handle": true },
      boxStyle = { display: "block" };

    if(this.props.folded === true) {
      handleClasses["folded"] = true;
      boxStyle.display = "none";
    }

    return (
      <div id="LayerBox" className="box">
        <h4 className={classnames(handleClasses)} onClick={::this.fold}>Layers</h4>
        <div className="foldable-fold" style={boxStyle}>
          <div ref="layers" className="layers">
          {this.props.layers.map((layer, i) => {
            return <LayerboxLayer
              key={`layer-${i}`}
              layer={layer}
              layerCount={this.props.layers.length}
              position={i}
              selected={layer.id === this.props.selected}
              layerName={this.props.layerName}
              layerOpacity={this.props.layerOpacity}
              layerSelect={this.props.layerSelect}
              layerVisibility={this.props.layerVisibility} />;
          })}
          </div>
          <div className="actions">
            <button title="New layer above selected layer" className="tiny transparent" onClick={::this.props.layerAdd}>
              <i className="flaticon-plus25"></i>
            </button>
            <button title="Delete selected layer" className="tiny transparent" disabled={deleteButtonDisabled}>
              <i className="flaticon-minus18"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.fitHeight();
  }

  componentDidUpdate() {
    this.fitHeight();
  }

  fold() {
    this.props.foldBox("layers");
  }

  fitHeight() {
    // fit height to available space
    const
      areaRightHeight = document.querySelector(".area.right").clientHeight,
      otherBoxesHeight = document.getElementById("layerboxhelper").clientHeight,
      height = areaRightHeight - otherBoxesHeight - 47;

    this.refs.layers.style.height = `${height}px`;
  }
}

export default Layerbox;
