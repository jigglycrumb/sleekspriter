var LayerBox = React.createClass({
  mixins: [FoldableMixin],
  render: function() {
    return (
      <div id="LayerBox" className="box">
        <h4 className="foldable-handle">Layers</h4>
        <div className="foldable-fold">
          {this.props.io.layers.map(function(layer) {
            var id = 'LayerBoxLayer-'+layer.id;
            return (
              <LayerBoxLayer key={id} layer={layer} size={this.props.io.size} zoom={this.props.editor.zoom} signal={this.props.signal}/>
            );
          }, this)}
          <div className="actions">
            <button title="New layer above selected layer" onClick={this.dispatchLayerAdded} className="tiny transparent"><i className="flaticon-plus25"></i></button>
            <button title="Delete selected layer" onClick={this.dispatchLayerRemoved} className="tiny transparent"><i className="flaticon-minus18"></i></button>
          </div>
        </div>
      </div>
    );
  },
  dispatchLayerAdded: function(event) {
    this.props.signal.layerAddedToIO.dispatch(this.props.editor.layer);
  },
  dispatchLayerRemoved: function(event) {
    this.props.signal.layerRemovedFromIO.dispatch(this.props.editor.layer);
  }
});