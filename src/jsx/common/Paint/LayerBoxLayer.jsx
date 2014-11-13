/** @jsx React.DOM */
var LayerBoxLayer = React.createClass({
  propTypes: {
     layer: React.PropTypes.object.isRequired // layer object
  },
  render: function() {
    var cssClass = 'LayerBoxLayer';
    if(this.props.layer.id == this.props.editor.layers.selected) cssClass+= ' selected';
    return (
      <div id={this.props.key} className={cssClass}>
        <div className="visibility">
          <input type="checkbox" checked={this.props.layer.visible} onChange={this.dispatchLayerVisibilityChanged}/>
        </div>
        <div className="preview" onClick={this.dispatchLayerSelected}>
          <LayerBoxLayerPreview ref="preview" id={this.props.layer.id} width={this.props.editor.file.size.width} height={this.props.editor.file.size.height} stage={false} />
        </div>
        <div className="name">
          <label ref="nameLabel" className="name-label" onClick={this.showNameInput}>{this.props.layer.name}</label>
          <input ref="nameText" className="name-text" type="text" defaultValue={this.props.layer.name} onKeyDown={this.dispatchLayerNameChanged}/>
        </div>
        <input ref="opacitySlider" type="range" className="opacity-slider" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
        <input ref="opacityNumber" type="number" className="opacity-number" min="0" max="100" value={this.props.layer.opacity} onChange={this.dispatchLayerOpacityChanged} />
      </div>
    );
  },
  componentDidMount: function() {
    this.refs.nameText.getDOMNode().addEventListener('blur', this.dispatchLayerNameChanged);
  },
  componentWillUnmount: function() {
    this.refs.nameText.getDOMNode().removeEventListener('blur', this.dispatchLayerNameChanged);
  },
  dispatchLayerSelected: function() {
    channel.publish('layer.select', {layer: this.props.layer.id});
  },
  dispatchLayerVisibilityChanged: function(event) {
    channel.publish('file.layer.visibility.toggle', {layer: this.props.layer.id, visible: event.target.checked});
  },
  dispatchLayerOpacityChanged: function(event) {
    channel.publish('file.layer.opacity.select', {layer: this.props.layer.id, opacity: parseInt(event.target.value)});
  },
  dispatchLayerNameChanged: function(event) {
    if(event.type == 'blur' || (event.nativeEvent.type == 'keydown' && event.nativeEvent.which == 13)) {

      this.refs.nameText.getDOMNode().style.display = 'none';
      this.refs.nameLabel.getDOMNode().style.display = 'block';

      if(!_.isEmpty(event.target.value.trim())) {
        this.refs.nameLabel.getDOMNode().innerHTML = event.target.value;
        channel.publish('file.layer.name.select', {layer: this.props.layer.id, name: event.target.value});
      }
    }
  },
  showNameInput: function() {
    this.refs.nameLabel.getDOMNode().style.display = 'none';
    this.refs.nameText.getDOMNode().style.display = 'block';
    this.refs.nameText.getDOMNode().focus();
  }
});