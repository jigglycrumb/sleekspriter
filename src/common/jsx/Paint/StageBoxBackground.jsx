// Flux: done
var StageBoxBackground = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(['color','pattern','image']).isRequired,
    value: React.PropTypes.string.isRequired,
  },
  render: function() {

    if(this.props.image.file !== null) return false;

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
      <div id="StageBoxBackground" className={classNames(classes)} style={style}></div>
    )
  },
});