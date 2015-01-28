var LayerBox = React.createClass({
  mixins: [FoldableMixin, PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      shouldSelectLayer: false,
      subscriptions: {
        'layer.add': this.shouldSelectLayer,
        'layer.delete': this.shouldSelectLayer,
        'box.fold': this.fitHeight,
      }
    }
  },
  render: function() {
    var disabled = this.props.editor.layers.frame.length <= 1 ? true : false;
    return (
      <div id="LayerBox" className="box">
        <h4 className="foldable-handle">Layers</h4>
        <div className="foldable-fold">
          <div className="layers">
            {this.props.editor.layers.frame.map(function(layer) {
              var selected = layer.id === this.props.editor.layers.selected ? true : false;
              return (
                <LayerBoxLayer key={layer.id} layer={layer} selected={selected} dimensions={this.props.editor.file.size} />
              );
            }, this)}
          </div>
          <div className="actions">
            <button title="New layer above selected layer" onClick={this.dispatchLayerAdded} className="tiny transparent"><i className="flaticon-plus25"></i></button>
            <button title="Delete selected layer" onClick={this.confirmLayerDelete} className="tiny transparent" disabled={disabled}><i className="flaticon-minus18"></i></button>
          </div>
        </div>
      </div>
    );
  },
  componentDidUpdate: function() {
    if(this.state.shouldSelectLayer !== false) {
      channel.gui.publish('layer.select', {layer: this.state.shouldSelectLayer});
      this.setState({ shouldSelectLayer: false });
    }

    this.fitHeight();
  },
  dispatchLayerAdded: function() {
    channel.file.publish('file.layer.add', {layer: this.props.editor.layers.selected});
  },
  confirmLayerDelete: function() {
    channel.gui.publish('modal.show', {component: ModalConfirmDeleteLayer});
  },
  shouldSelectLayer: function(data) {
    this.setState({ shouldSelectLayer: data.layer });
  },
  fitHeight: function() {
    var areaRightHeight = document.querySelector('.area.right').clientHeight,
        otherBoxesHeight = document.getElementById('layerboxhelper').clientHeight,
        height = areaRightHeight - otherBoxesHeight - 48;
    this.getDOMNode().querySelector('.layers').style.height = height+'px';
  },
});