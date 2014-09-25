/** @jsx React.DOM */
var ToolContainer = React.createClass({
  render: function() {
    return window[this.props.editor.tool.selected](this.props);
  }
});