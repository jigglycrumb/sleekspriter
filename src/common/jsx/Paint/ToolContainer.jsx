// Flux: done
var ToolContainer = React.createClass({
  render: function() {
    return React.createElement(window[this.props.ui.tool], this.props);
  }
});