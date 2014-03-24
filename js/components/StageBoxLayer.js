var StageBoxLayer = React.createClass({
  render: function() {

    var cssClass = 'Layer';
    if(this.props.visible === false) cssClass+= ' hidden';

    var display = (this.props.layer.visible===true) ? 'block' : 'none';

    return (
      <canvas
        id={this.props.key}
        className={cssClass}
        width={this.props.width}
        height={this.props.height}
        style={{
          zIndex: this.props.layer.z,
          opacity: this.props.layer.opacity/100,
          display: display,
          width: this.props.width,
          height: this.props.height
        }}>
      </canvas>
    );
  }
});