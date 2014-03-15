var ToolContainer = React.createClass({
  render: function() {
    //console.log('rendering '+this.props.editor.tool);
    return window[this.props.editor.tool](this.props);
  }
});