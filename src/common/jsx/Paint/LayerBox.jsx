var LayerBox = React.createClass({
  mixins: [FoldableMixin],
  getInitialState: function() {
    return {
      shouldSelectLayer: false
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
  componentDidMount: function() {
    channel.subscribe('app.layer.add', this.shouldSelectLayer);
    channel.subscribe('app.layer.delete', this.shouldSelectLayer);
  },
  componentDidUpdate: function() {
    if(this.state.shouldSelectLayer !== false) {
      channel.publish('layer.select', {layer: this.state.shouldSelectLayer});
      this.setState({ shouldSelectLayer: false });
    }

    var h = this.calculateHeight();
    this.getDOMNode().querySelector('.layers').style.height = h+'px';
  },
  dispatchLayerAdded: function() {
    channel.publish('file.layer.add', {layer: this.props.editor.layers.selected});
  },
  confirmLayerDelete: function() {
    channel.publish('modal.show', {component: ModalConfirmDeleteLayer});
  },
  shouldSelectLayer: function(data) {
    this.setState({ shouldSelectLayer: data.layer });
  },
  calculateHeight: function() {
    var areaRightHeight = document.querySelector('.area.right').clientHeight,
        otherBoxesHeight = document.getElementById('layerboxhelper').clientHeight;

    return areaRightHeight - otherBoxesHeight - 48;
  },
});