var LayerBox = React.createClass({
  mixins: [FoldableMixin, PostalSubscriptionMixin],
  dragPosition: 0,
  dragLayer: 0,
  getInitialState: function() {
    return {
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
    var disabled = this.props.editor.layers.frame.length <= 1 ? true : false;
    return (
      <div id="LayerBox" className="box">
        <h4 className="foldable-handle">Layers</h4>
        <div className="foldable-fold">
          <div ref="layers" className="layers" onDragOver={this.dragOver} onDrop={this.drop}>
            {this.props.editor.layers.frame.map(function(layer) {
              var selected = layer.id === this.props.editor.layers.selected ? true : false;
              return (
                <LayerBoxLayer
                  key={layer.id}
                  layer={layer}
                  selected={selected}
                  dimensions={this.props.editor.file.size} />
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

  dragStart: function(data) {
    this.dragLayer = data.layer;
  },

  dragOver: function(e) {
    e.preventDefault();

    var x = e.pageX - e.currentTarget.offsetLeft;
    var y = e.pageY - e.currentTarget.offsetTop - 63;

    this.dragPosition = Math.floor(y/41);
    if(this.dragPosition < 0) this.dragPosition = 0;
    if(this.dragPosition > this.props.editor.layers.frame.length) this.dragPosition = this.props.editor.layers.frame.length;

    if(e.target.className === 'LayerBoxLayer') {
      e.target.parentNode.insertBefore(placeholder.layerdrop, e.target);
    }
    else if(e.target.className === 'layers') {
      e.target.appendChild(placeholder.layerdrop);
    }
  },

  drop: function(e) {
    e.currentTarget.removeChild(placeholder.layerdrop);
    channel.file.publish('layer.drop', {layer: this.dragLayer, position: this.dragPosition});
    this.dragLayer = 0;
    this.dragPosition = 0;
  },

});