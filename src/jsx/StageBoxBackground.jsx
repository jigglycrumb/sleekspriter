/** @jsx React.DOM */
var StageBoxBackground = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(['color','pattern','image']).isRequired,
    value: React.PropTypes.string.isRequired,
  },
  render: function() {

    var style = {},
        classes = {};

    switch(this.props.type) {
      case 'color':
        style.backgroundColor = this.props.value;
        break;
      case 'pattern':
        classes[this.props.value] = true;
        break;
    }

    return (
      <div id="StageBoxBackground" className={React.addons.classSet(classes)} style={style}></div>
    )
  },
});