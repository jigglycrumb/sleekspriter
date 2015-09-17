var LayerBox = React.createClass({
  mixins: [FluxMixin, FoldableMixin],
  getInitialState: function() {
    return {
      dragPosition: 0,
      dragLayer: 0,
    }
  },
  render: function() {
    var disabled = this.props.ui.layers.frame.length <= 1 ? true : false;
    var layers = _.clone(this.props.ui.layers.frame, true);

    if(this.state.dragLayer != 0) {
      layers.splice(this.state.dragPosition, 0, 'dropzone').join();
    }

    var handleClasses = {'foldable-handle': true},
        boxStyle = {display: 'block'};

    if(this.props.ui.fold.layers === true) {
      handleClasses['folded'] = true;
      boxStyle.display = 'none';
    }

    return (
      <div id="LayerBox" className="box">
        <h4 className={classNames(handleClasses)} onClick={this.fold}>Layers</h4>
        <div className="foldable-fold" style={boxStyle}>
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
                    ui={this.props.ui}
                    file={this.props.file}
                    pixels={this.props.pixels}
                    dragStartHandler={this.dragStart} />
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
    this.getDOMNode().querySelector('.layers').style.height = height+'px';
  },

  dragStart: function(layer) {
    console.log('starting to drag layer '+layer);
    this.setState({dragLayer: layer});
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
    this.getFlux().actions.layerDrop(this.state.dragLayer, this.state.dragPosition);
    this.setState({
      dragLayer: 0,
      dragPosition: 0,
    });
  },
});