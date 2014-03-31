var PaletteSwatch = React.createClass({
  propTypes: {
    color: React.PropTypes.string.isRequired,
  },
  render: function() {
    return (
      <div
        className="colorswatch"
        style={{background: this.props.color}}
        title={this.props.color}
        onClick={this.select} />
    );
  },
  select: function() {
    this.props.signal.colorSelected.dispatch(this.props.color);
  }
});