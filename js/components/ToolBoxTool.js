// clean
var ToolBoxTool = React.createClass({
  render: function() {
    return (
      <button
        id={this.props.id}
        className="ToolBoxTool transparent"
        title={this.props.title}
        disabled={this.props.id == this.props.editor.tool ? true : false}
        onClick={this.dispatchToolSelected.bind(this, this.props.id)}>
          <i className={this.props.icon}></i>
      </button>
    );
  },
  dispatchToolSelected: function(tool, event) {
    this.props.signal.toolSelected.dispatch(tool);
  }
});