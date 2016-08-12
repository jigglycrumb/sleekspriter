var AppMenuSubMenu = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    visible: React.PropTypes.bool,
    items: React.PropTypes.array
  },
  render: function() {
    var style = {
      display: this.props.visible === true ? 'block' : 'none'
    };

    if(this.props.label == '---') {
      return <hr />;
    }
    else {
      return (
        <li onClick={this.props.clickHandler}>
          <label>{this.props.label}</label>
          <ul style={style}>
            {this.props.items.map(function(item, i) {
              return (
                <li key={i} onClick={item.action}>{item.label}</li>
              );
            })}
          </ul>
        </li>
      );
    }
  },
});
