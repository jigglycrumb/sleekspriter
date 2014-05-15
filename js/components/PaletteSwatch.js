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
    channel.publish('app.color.select', {color: this.props.color});
  }
});