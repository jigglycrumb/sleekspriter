var LayerBoxLayer = React.createClass({
  mixins: [FluxMixin, TouchMixin],
  propTypes: {
     layer: React.PropTypes.object.isRequired // layer object
  },
  render: function() {
    var htmlId    = 'LayerBoxLayer-'+this.props.layer.id,
        cssClass  = classNames({
          LayerBoxLayer: true,
          selected: this.props.selected,
          first: this.props.position === 0,
          last: this.props.position === this.props.ui.layers.frame.length - 1,
        });

    return (
      <div id={htmlId} className={cssClass}>
        <div className="order up" onClick={this.handleClick.bind(this, this.dispatchMoveLayerUp)} onTouchStart={this.handleTouch.bind(this, this.dispatchMoveLayerUp)}>
          <i className="flaticon-little16"></i>
        </div>
        <div className="visibility">
          <input type="checkbox" checked={this.props.layer.visible} onChange={this.dispatchLayerVisibilityChanged} />
        </div>
        <div className="preview" onClick={this.handleClick.bind(this, this.dispatchLayerSelected)} onTouchStart={this.handleTouch.bind(this, this.dispatchLayerSelected)}>
          <LayerCanvas layer={this.props.layer.id} zoom={this.props.ui.zoom.selected} file={this.props.file} pixels={this.props.pixels} maxSize={30} />
        </div>
        <NameEditable name={this.props.layer.name} callback={this.dispatchLayerNameChanged} />
        <input type="range" className="opacity-slider" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
        <input type="number" className="opacity-number" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
        <div className="order down" onClick={this.handleClick.bind(this, this.dispatchMoveLayerDown)} onTouchStart={this.handleTouch.bind(this, this.dispatchMoveLayerDown)}>
          <i className="flaticon-little16"></i>
        </div>
      </div>
    );
  },
  dispatchLayerSelected: function() {
    var oldScope = this.props.ui.layers.selected;
    this.getFlux().actions.layerSelect(this.props.layer.id);
    this.getFlux().actions.scopeSet(oldScope, 'layer', this.props.layer.id);
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
  dispatchMoveLayerUp: function() {
    var newPosition = this.props.position - 1;
    if(newPosition >= 0) {
      this.getFlux().actions.layerDrop(this.props.layer.id, newPosition);
    }
  },
  dispatchMoveLayerDown: function() {
    var newPosition = this.props.position + 1;
    if(newPosition < this.props.ui.layers.frame.length) {
      this.getFlux().actions.layerDrop(this.props.layer.id, newPosition);
    }
  },
});
