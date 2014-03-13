// clean
var ToolBoxTool = React.createClass({
  render: function() {
    return (
      <button id={this.props.id} className="ToolBoxTool transparent" title={this.props.title} onClick={this.dispatchToolSelected.bind(this, this.props.id)}>
        <i className={this.props.icon}></i>
      </button>
    );
  },
  componentDidMount: function() {
   this.props.signal.toolSelected.add(this.onToolSelected);
  },
  dispatchToolSelected: function(tool, event) {
    this.props.signal.toolSelected.dispatch(tool);
  },
  onToolSelected: function(tool) {
    if(this.props.id == tool) {
      this.getDOMNode().disabled = true;
      React.renderComponent(new window[tool](), document.querySelector('.area.top'));
    }
    else {
      this.getDOMNode().disabled = false;
    }
  }
});