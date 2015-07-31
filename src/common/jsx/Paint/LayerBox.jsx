var LayerBox = React.createClass({
  mixins: [FluxMixin, FoldableMixin, PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      dragPosition: 0,
      dragLayer: 0,
      shouldSelectLayer: false,
      subscriptions: {
        'layer.add': this.shouldSelectLayer,
        'layer.delete': this.shouldSelectLayer,
        'box.fold': this.fitHeight,
        'layer.dragstart': this.dragStart,
      }
    }
  },
  render: function() {
    var disabled = this.props.ui.layers.frame.length <= 1 ? true : false;
    var layers = _.clone(this.props.ui.layers.frame, true);

    if(this.state.dragLayer != 0) {
      layers.splice(this.state.dragPosition, 0, 'dropzone').join();
    }

    return (
      <div id="LayerBox" className="box">
        <h4 className="foldable-handle">Layers</h4>
        <div className="foldable-fold">
          <div ref="layers" className="layers" onDragOver={this.dragOver} onDrop={this.drop}>
            {layers.map(function(layer) {
              if(layer === 'dropzone') return <LayerBoxDrophelper key="layerdropzone" />
              else {
                var selected = layer.id === this.props.ui.layers.selected ? true : false;
                return (
                  <LayerBoxLayer
                    key={layer.id}
                    layer={layer}
                    selected={selected}
                    dimensions={this.props.file.size}
                    ui={this.props.ui} />
                )
              }
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
    channel.file.publish('layer.add', {layer: this.props.ui.layers.selected});
  },
  confirmLayerDelete: function() {
    this.getFlux().actions.modalShow(ModalConfirmDeleteLayer);
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

  dragStart: function(data) {
    this.setState({dragLayer: data.layer});
  },
  dragOver: function(e) {
    e.preventDefault();

    var x = e.pageX - e.currentTarget.offsetLeft,
        y = e.pageY - e.currentTarget.offsetTop - 63,
        dragPosition = Math.floor(y/41);

    if(dragPosition < 0) dragPosition = 0;
    if(dragPosition > this.props.ui.layers.frame.length) dragPosition = this.props.ui.layers.frame.length;

    this.setState({dragPosition: dragPosition});
  },
  drop: function(e) {
    channel.file.publish('layer.drop', {layer: this.state.dragLayer, position: this.state.dragPosition});
    this.setState({
      dragLayer: 0,
      dragPosition: 0,
    })
  },
});