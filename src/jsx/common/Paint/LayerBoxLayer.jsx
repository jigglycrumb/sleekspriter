var LayerBoxLayer = React.createClass({
  propTypes: {
     layer: React.PropTypes.object.isRequired // layer object
  },
  render: function() {
    var htmlId = 'LayerBoxLayer-'+this.props.layer.id;
        cssClass = 'LayerBoxLayer';
    if(this.props.layer.id == this.props.editor.layers.selected) cssClass+= ' selected';
    return (
      <div id={htmlId} className={cssClass}>
        <div className="visibility">
          <input type="checkbox" checked={this.props.layer.visible} onChange={this.dispatchLayerVisibilityChanged}/>
        </div>
        <div className="preview" onClick={this.dispatchLayerSelected}>
          <LayerBoxLayerPreview ref="preview" id={this.props.layer.id} width={this.props.editor.file.size.width} height={this.props.editor.file.size.height} stage={false} />
        </div>
        <NameEditable name={this.props.layer.name} callback={this.dispatchLayerNameChanged} />
        <input type="range" className="opacity-slider" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
        <input type="number" className="opacity-number" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
      </div>
    );
  },
  dispatchLayerSelected: function() {
    channel.publish('layer.select', {layer: this.props.layer.id});
  },
  dispatchLayerVisibilityChanged: function(event) {
    channel.publish('file.layer.visibility.toggle', {layer: this.props.layer.id, visible: event.target.checked});
  },
  dispatchLayerOpacityChanged: function(event) {
    channel.publish('file.layer.opacity.select', {layer: this.props.layer.id, opacity: parseInt(event.target.value)});
  },
  dispatchLayerNameChanged: function(name) {
    channel.publish('file.layer.name.select', {layer: this.props.layer.id, name: name});
  },
});