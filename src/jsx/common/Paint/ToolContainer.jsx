/** @jsx React.DOM */
var ToolContainer = React.createClass({
  render: function() {
    return React.createElement(window[this.props.editor.tool.selected], this.props);
  }
});