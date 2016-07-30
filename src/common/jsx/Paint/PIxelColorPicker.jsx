var PixelColorPicker = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    var css = {
      display: this.props.visible ? 'block' : 'none'
    };

    return (
      <div className="color-picker" style={css}>
        <ColorPicker.SketchPicker color={this.props.color} onChangeComplete={this.dispatchColorSelected} />
      </div>
    );
  },
  dispatchColorSelected: function(color) {
    this.getFlux().actions.colorBrush(color.hex);
  },
});
