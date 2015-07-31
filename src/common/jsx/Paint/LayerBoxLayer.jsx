var LayerBoxLayer = React.createClass({
  mixins: [FluxMixin],
  propTypes: {
     layer: React.PropTypes.object.isRequired // layer object
  },
  render: function() {
    var htmlId    = 'LayerBoxLayer-'+this.props.layer.id,
        cssClass  = classNames({
          LayerBoxLayer: true,
          selected: this.props.selected,
        });

    return (
      <div id={htmlId} className={cssClass} draggable="true" onDragStart={this.dragStart}>
        <div className="visibility">
          <input type="checkbox" checked={this.props.layer.visible} onChange={this.dispatchLayerVisibilityChanged}/>
        </div>
        <div className="preview" onClick={this.dispatchLayerSelected}>
          <LayerBoxLayerPreview ref="preview" id={this.props.layer.id} width={this.props.dimensions.width} height={this.props.dimensions.height} stage={false} />
        </div>
        <NameEditable name={this.props.layer.name} callback={this.dispatchLayerNameChanged} />
        <input type="range" className="opacity-slider" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
        <input type="number" className="opacity-number" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
      </div>
    );
  },
  dispatchLayerSelected: function() {
    this.getFlux().actions.layerSelect(this.props.layer.id);
  },
  dispatchLayerVisibilityChanged: function(event) {
    this.getFlux().actions.layerVisibility(this.props.layer.id, event.target.checked);
  },
  dispatchLayerOpacityChanged: function(event) {
    this.getFlux().actions.layerOpacity(this.props.layer.id, event.target.value);
  },
  dispatchLayerNameChanged: function(name) {
    this.getFlux().actions.layerName(this.props.layer.id, name);
  },
  dragStart: function(e) {
    channel.gui.publish('layer.dragstart', {layer: this.props.layer.id});
  },
});