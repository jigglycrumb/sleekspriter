var ExportButton = React.createClass({
  render: function() {
    return (
      <a className="button" ref="theButton" onClick={this.export}>Export</a>
    )
  },
  export: function() {
    var self = this,
        fs = require('fs'),
        sys = require('sys');

    if(this.props.part === 'animation') {
      var gif = new GIF({
                      workers: 2,
                      quality: 1,
                      // background: '#ff0000',
                      transparent: 0x000000,
                    }),
          canvas = NodeList2Array(document.getElementById('ExportPreview').querySelector('.animation-frames').querySelectorAll('.preview')),
          delay = 1000/this.props.editor.animations.getByName(this.props.animation).fps;

      function exportGif(blob) {
       var reader = new FileReader();
       reader.onload = writeGif;
       reader.readAsDataURL(blob);
      }

      function writeGif(e) {
        var data = e.target.result.replace(/^data:image\/\w+;base64,/, ""),
            buf = new Buffer(data, 'base64'),
            target = file.folder+'/'+file.name+'-'+self.props.animation+'.gif';

        fs.writeFile(target, buf);

        channel.publish('export.finished', {
          folder: file.folder,
          name: file.name,
          format: self.props.format,
          part: self.props.part,
          frames: self.props.editor.frames.total,
          animation: self.props.animation,
        });
      }

      canvas.forEach(function(canvas) {
        gif.addFrame(canvas, {delay: delay});
      });

      gif.on('finished', exportGif);
      gif.render();
    }
    else {
      var canvas = NodeList2Array(document.getElementById('ExportPreview').querySelectorAll('.preview')),
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
    }
  },
});