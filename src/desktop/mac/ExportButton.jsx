var ExportButton = React.createClass({
  render: function() {
    return (
      <a className="button" ref="theButton" onClick={this.export}>Export</a>
    )
  },
  export: function() {
    var canvas = NodeList2Array(document.getElementById('ExportPreview').querySelectorAll('.preview')),
        self = this,
        fs = require('fs'),
        sys = require('sys'),
        frame = 1;

    function saveCanvas(canvas, fileName) {
      var img = canvas.toDataURL('image/'+self.props.format),
          data = img.replace(/^data:image\/\w+;base64,/, ""),
          buf = new Buffer(data, 'base64'),
          target = file.folder+'/'+fileName+'.'+(self.props.format === 'jpeg' ? 'jpg' : self.props.format);

      fs.writeFile(target, buf);
    }

    canvas.forEach(function(canvas) {
      var fileName = file.name;
      if(self.props.part === 'oneframe') fileName+= '-frame-'+self.props.frame;
      else if(self.props.part === 'allframes') {
        fileName+= '-frame-'+frame;
        frame++;
      }
      saveCanvas(canvas, fileName);
    });

    channel.publish('export.finished', {
      folder: file.folder,
      name: file.name,
      format: this.props.format,
      part: this.props.part,
      frames: this.props.editor.frames.total,
    });
  },
});