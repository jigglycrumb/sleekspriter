// Flux: done
var PaletteSwatch = React.createClass({
  mixins: [FluxMixin],
  propTypes: {
    color: React.PropTypes.string.isRequired,
  },
  render: function() {
    return (
      <div
        className="colorswatch"
        style={{background: this.props.color}}
        title={this.props.color}
        onClick={this.select}
        onTouchStart={this.select} />
    );
  },
  select: function() {
    this.getFlux().actions.colorBrush(this.props.color);
  }
});
