import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { LayerCanvas } from "../canvases";
import NameEditable from "../common/NameEditable";
import { sizeShape } from "../../shapes";

class LayerboxLayer extends React.Component {
  constructor(props) {
    super(props);
    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleOpacityChange = this.handleOpacityChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.layerCanvas = null;
  }

  componentDidMount() {
    this.props.registerLayerCanvas(this.props.layer.id, this.layerCanvas);
  }

  componentWillUnmount() {
    this.props.unregisterLayerCanvas(this.props.layer.id);
  }

  render() {
    const htmlId = "LayerBoxLayer-" + this.props.layer.id;
    const cssClass = classnames({
      LayerBoxLayer: true,
      selected: this.props.selected,
      first: this.props.position === 0,
      last: this.props.position === this.props.layerCount - 1,
    });

    return (
      <div id={htmlId} className={cssClass}>
        <div className="order up" onClick={this.handleMoveUp}>
          <i className="flaticon-little16" />
        </div>
        <div className="visibility">
          <input
            type="checkbox"
            checked={this.props.layer.visible}
            onChange={this.handleVisibilityChange}
          />
        </div>
        <div className="preview" onClick={this.handleSelect}>
          <LayerCanvas
            ref={n => (this.layerCanvas = n)}
            frame={this.props.layer.frame}
            layer={this.props.layer.id}
            pixels={this.props.pixels}
            size={this.props.size}
            maxSize={30}
          />
        </div>
        <NameEditable
          name={this.props.layer.name}
          callback={this.onNameChange}
        />
        <input
          type="range"
          className="opacity-slider"
          min="0"
          max="100"
          value={this.props.layer.opacity}
          onChange={this.handleOpacityChange}
        />
        <input
          type="number"
          className="opacity-number"
          min="0"
          max="100"
          value={this.props.layer.opacity}
          onChange={this.handleOpacityChange}
        />
        <div className="order down" onClick={this.handleMoveDown}>
          <i className="flaticon-little16" />
        </div>
      </div>
    );
  }

  handleOpacityChange(e) {
    this.props.layerOpacity(this.props.layer.id, e.target.value);
  }

  handleVisibilityChange(e) {
    this.props.layerVisibility(this.props.layer.id, e.target.checked);
  }

  handleSelect() {
    this.props.layerSelect(this.props.layer.id);
  }

  onNameChange(name) {
    this.props.layerName(this.props.layer.id, name);
  }

  handleMoveUp() {
    this.props.layerMoveUp(
      this.props.layer.frame,
      this.props.layer.id,
      this.props.layer.z
    );
  }

  handleMoveDown() {
    this.props.layerMoveDown(
      this.props.layer.frame,
      this.props.layer.id,
      this.props.layer.z
    );
  }
}

LayerboxLayer.propTypes = {
  layer: PropTypes.shape({
    frame: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    opacity: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  layerCount: PropTypes.number.isRequired,
  layerMoveUp: PropTypes.func.isRequired,
  layerMoveDown: PropTypes.func.isRequired,
  layerName: PropTypes.func.isRequired,
  layerOpacity: PropTypes.func.isRequired,
  layerSelect: PropTypes.func.isRequired,
  layerVisibility: PropTypes.func.isRequired,
  pixels: PropTypes.object,
  position: PropTypes.number.isRequired,
  registerLayerCanvas: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  size: sizeShape.isRequired,
  unregisterLayerCanvas: PropTypes.func.isRequired,
};

export default LayerboxLayer;
