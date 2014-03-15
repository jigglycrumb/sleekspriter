var LayerBoxLayer = React.createClass({
  render: function() {
    return (
      <div id={this.props.key} className="LayerBoxLayer">
        <div className="visibility">
          <input type="checkbox" checked={this.props.layer.visible} onChange={this.dispatchLayerVisibilityChanged}/>
        </div>
        <LayerBoxLayerPreview ref="preview" layer={this.props.layer.id} size={this.props.size} zoom={this.props.zoom} signal={signal}/>
        <div className="name">
          <label ref="nameLabel" className="name-label" onClick={this.showNameInput}>{this.props.layer.name}</label>
          <input ref="nameText" className="name-text" type="text" defaultValue={this.props.layer.name} onKeyDown={this.dispatchLayerNameChanged}/>
        </div>
        <input ref="opacitySlider" type="range" className="opacity-slider" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
        <input ref="opacityNumber" type="number" className="opacity-number" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
      </div>
    );
  },
  componentDidMount: function() {
    this.refs.nameText.getDOMNode().addEventListener('blur', this.dispatchLayerNameChanged);
    this.props.signal.layerSelected.add(this.onLayerSelected);
  },
  componentWillUnmount: function() {
    this.props.signal.layerSelected.remove(this.onLayerSelected);
  },
  dispatchLayerVisibilityChanged: function(event) {
    this.props.signal.layerVisibilityChanged.dispatch(this.props.layer.id, event.target.checked);
  },
  dispatchLayerOpacityChanged: function(event) {
    this.props.signal.layerOpacityChanged.dispatch(this.props.layer.id, parseInt(event.target.value, 10));
  },
  dispatchLayerNameChanged: function(event) {
    if(event.type == 'blur' || (event.nativeEvent.type == 'keydown' && event.nativeEvent.which == 13)) {
      this.refs.nameText.getDOMNode().style.display = 'none';
      this.refs.nameLabel.getDOMNode().innerHTML = event.target.value;
      this.refs.nameLabel.getDOMNode().style.display = 'block';
      this.props.signal.layerNameChanged.dispatch(this.props.layer.id, event.target.value);
    }
  },
  onLayerSelected: function(layer) {
    if(this.props.layer.id == layer) {
      this.getDOMNode().classList.add('selected');
    }
    else {
      this.getDOMNode().classList.remove('selected');
    }
  },
  showNameInput: function() {
    this.refs.nameLabel.getDOMNode().style.display = 'none';
    this.refs.nameText.getDOMNode().style.display = 'block';
    this.refs.nameText.getDOMNode().focus();
  }
});