var ToolBoxTool = React.createClass({
  render: function() {
    var selected = this.props.id == this.props.editor.tool.selected ? true : false;
    var cssClasses = 'ToolBoxTool transparent';
    if(selected) cssClasses+= ' active';

    return (
      <button
        id={this.props.id}
        className={cssClasses}
        title={this.props.title}
        disabled={selected}
        onClick={this.dispatchToolSelected.bind(this, this.props.id)}>
          <i className={this.props.icon}></i>
      </button>
    );
  },
  dispatchToolSelected: function(tool) {
    channel.publish('tool.select', {tool: tool});
  }
});