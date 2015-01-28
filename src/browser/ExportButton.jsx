var ExportButton = React.createClass({
  render: function() {
    return (
      <a className="button" ref="theButton" onClick={this.export}>Export</a>
    )
  },
  export: function() {
    var canvas = NodeList2Array(document.getElementById('ExportPreview').querySelectorAll('.preview'));

    if(canvas.length === 1) {
      var fileName = file.name,
          node = this.refs.theButton.getDOMNode();

      if(this.props.part === 'oneframe') fileName+= '-frame-'+this.props.frame;

      node.download = fileName+'.'+(this.props.format === 'jpeg' ? 'jpg' : this.props.format);
      node.href = canvas[0].toDataURL('image/'+this.props.format);
      channel.gui.publish('export.finished', {folder: file.folder, name: fileName, format: this.props.format, part: this.props.part});
    }
  },
});