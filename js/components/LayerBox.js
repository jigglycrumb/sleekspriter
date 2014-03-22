var LayerBox = React.createClass({
  mixins: [FoldableMixin],
  getInitialState: function() {
    return {
      shouldSelectLayer: false
    }
  },
  render: function() {
    var disabled = this.props.file.layers.length == 1 ? true : false;
    return (
      <div id="LayerBox" className="box">
        <h4 className="foldable-handle">Layers</h4>
        <div className="foldable-fold">
          {this.props.file.layers.map(function(layer) {
            var id = 'LayerBoxLayer-'+layer.id;
            return (
              <LayerBoxLayer key={id} layer={layer} size={this.props.file.size} editor={this.props.editor} signal={this.props.signal}/>
            );
          }, this)}
          <div className="actions">
            <button title="New layer above selected layer" onClick={this.dispatchLayerAdded} className="tiny transparent"><i className="flaticon-plus25"></i></button>
            <button title="Delete selected layer" onClick={this.dispatchLayerRemoved} className="tiny transparent" disabled={disabled}><i className="flaticon-minus18"></i></button>
          </div>
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    this.props.signal.layerAdded.add(this.shouldSelectLayer);
    this.props.signal.layerRemoved.add(this.shouldSelectLayer);
  },
  componentDidUpdate: function() {
    if(this.state.shouldSelectLayer !== false) {
      this.props.signal.layerSelected.dispatch(this.state.shouldSelectLayer);
      this.setState({ shouldSelectLayer: false });
    }
  },
  dispatchLayerAdded: function(event) {
    this.props.signal.layerAddedToIO.dispatch(this.props.editor.layer);
  },
  dispatchLayerRemoved: function(event) {
    this.props.signal.layerRemovedFromIO.dispatch(this.props.editor.layer);
  },
  shouldSelectLayer: function(layer) {
    this.setState({ shouldSelectLayer: layer });
  }
});