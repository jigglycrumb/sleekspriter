var AppMenuWrapper = React.createClass({
  render: function() {
    var style = {
      display: this.props.visible === true ? 'block' : 'none'
    };

    return (
      <ul id="AppMenuWrapper" style={style}>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    );
  }
});
