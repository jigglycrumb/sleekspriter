var ExportButton = React.createClass({
  render: function() {
    return (
      <a className="button" ref="theButton" onClick={this.export}>Export</a>
    )
  },
  export: function() {
    var filename = this.props.editor.file.name.substr(0, this.props.editor.file.name.lastIndexOf('.')),
        canvas = NodeList2Array(document.getElementById('ExportPreview').querySelectorAll('.preview'));

    if(canvas.length === 1) {
      var node = this.refs.theButton.getDOMNode();
      node.download = filename+'.'+(this.props.format === 'jpeg' ? 'jpg' : this.props.format);
      node.href = canvas[0].toDataURL('image/'+this.props.format);
    }
  },
});