var ExportButton = React.createClass({
  render: function() {
    return (
      <a className="button" ref="theButton" onClick={this.export}>Export</a>
    )
  },
  export: function() {
    var canvas = NodeList2Array(document.getElementById('ExportPreview').querySelectorAll('.preview'));

    if(canvas.length === 1) {
      var self = this,
          fs = require('fs'),
          sys = require('sys'),
          img = canvas[0].toDataURL('image/'+this.props.format),
          data = img.replace(/^data:image\/\w+;base64,/, ""),
          buf = new Buffer(data, 'base64'),
          fileName = file.name,
          target;

      if(this.props.part === 'oneframe') fileName+= '-frame-'+this.props.frame;

      target = file.folder+'/'+fileName+'.'+(this.props.format === 'jpeg' ? 'jpg' : this.props.format);

      fs.writeFile(target, buf, function(error) {
        if(error) throw error;
        channel.publish('export.finished', {folder: file.folder, name: fileName, format: self.props.format});
      });
    }
  },
});