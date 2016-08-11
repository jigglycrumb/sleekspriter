var LayerBox = React.createClass({
  mixins: [FluxMixin, TouchMixin, FoldableMixin],
  render: function() {
    var deleteButtonDisabled = this.props.ui.layers.frame.length <= 1,
        handleClasses = {'foldable-handle': true},
        boxStyle = {display: 'block'};

    if(this.props.ui.fold.layers === true) {
      handleClasses['folded'] = true;
      boxStyle.display = 'none';
    }

    return (
      <div id="LayerBox" className="box">
        <h4 className={classNames(handleClasses)} onClick={this.handleClick.bind(this, this.fold)} onTouchStart={this.handleTouch.bind(this, this.fold)}>Layers</h4>
        <div className="foldable-fold" style={boxStyle}>
          <div ref="layers" className="layers">
            {this.props.ui.layers.frame.map(function(layer, i) {
              var selected = layer.id === this.props.ui.layers.selected ? true : false;
              return (
                <LayerBoxLayer
                  position={i}
                  key={layer.id}
                  layer={layer}
                  selected={selected}
                  ui={this.props.ui}
                  file={this.props.file}
                  pixels={this.props.pixels} />
              );
            }, this)}
          </div>
          <div className="actions">
            <button title="New layer above selected layer" onClick={this.handleClick.bind(this, this.dispatchLayerAdded)} onTouchStart={this.handleTouch.bind(this, this.dispatchLayerAdded)} className="tiny transparent"><i className="flaticon-plus25"></i></button>
            <button title="Delete selected layer" onClick={this.handleClick.bind(this, this.confirmLayerDelete)} onTouchStart={this.handleTouch.bind(this, this.confirmLayerDelete)} className="tiny transparent" disabled={deleteButtonDisabled}><i className="flaticon-minus18"></i></button>
          </div>
        </div>
      </div>
    );
  },
  componentDidUpdate: function() {
    this.fitHeight();
  },
  dispatchLayerAdded: function() {
    this.getFlux().actions.layerAdd(this.props.ui.layers.selected);
  },
  confirmLayerDelete: function() {
    this.getFlux().actions.modalShow(ModalConfirmDeleteLayer);
  },
  fitHeight: function() {
    var areaRightHeight = document.querySelector('.area.right').clientHeight,
        otherBoxesHeight = document.getElementById('layerboxhelper').clientHeight,
        height = areaRightHeight - otherBoxesHeight - 47;
    ReactDOM.findDOMNode(this).querySelector('.layers').style.height = height+'px';
  },
});
