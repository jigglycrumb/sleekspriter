var ModalConfirmDeleteLayer = React.createClass({
  mixins: [FluxMixin, TouchMixin, ModalBasicMixin],
  render: function() {
    var layer = storeUtils.layers.getSelected();
    return (
      <div className="dialog">
        <div className="title">Confirmation needed</div>
        <div className="text">Are you sure you want to delete the layer "{layer.name}"?</div>
        <div className="actions">
          <button onClick={this.handleClick.bind(this, this.deleteLayer)} onTouchStart={this.handleTouch.bind(this, this.deleteLayer)}>Delete layer</button>
          <button onClick={this.handleClick.bind(this, this.hide)} onTouchStart={this.handleTouch.bind(this, this.hide)}>Cancel</button>
        </div>
      </div>
    )
  },
  deleteLayer: function() {
    this.getFlux().actions.layerDelete(this.props.ui.layers.selected);
    this.getFlux().actions.layerTopSelect();
    this.getFlux().actions.scopeSet(null, 'layer');
    this.hide();
  },
});
