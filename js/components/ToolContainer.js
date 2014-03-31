var ToolContainer = React.createClass({
  render: function() {
    return window[this.props.editor.tool](this.props);
  }
});