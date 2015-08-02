var ExportButton = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    return (
      <a className="button" ref="theButton" onClick={this.export}>Export</a>
    )
  },
  export: function() {
    var self = this,
        fs = require('fs'),
        sys = require('sys');

    if(this.props.file.folder === null) {
      this.getFlux().actions.modalShow(ModalErrorSaveBeforeExport);
      return;
    }

    if(this.props.ui.export.part === 'animation') {
      var gif = new GIF({
                      workers: 2,
                      quality: 1,
                      // background: '#ff0000',
                      transparent: 0x000000,
                    }),
          canvas = NodeList2Array(document.getElementById('ExportPreview').querySelector('.animation-frames').querySelectorAll('.preview')),
          delay = 1000/storeUtils.animations.getById(this.props.ui.export.animation).fps;

      function exportGif(blob) {
       var reader = new FileReader();
       reader.onload = writeGif;
       reader.readAsDataURL(blob);
      }

      function writeGif(e) {
        var data = e.target.result.replace(/^data:image\/\w+;base64,/, ""),
            buf = new Buffer(data, 'base64'),
            target = this.props.file.folder+'/'+this.props.file.name+'-'+self.props.ui.export.animation+'.gif';

        fs.writeFile(target, buf);

        channel.gui.publish('export.finished', {
          folder: this.props.file.folder,
          name: this.props.file.name,
          format: self.props.ui.export.format,
          part: self.props.ui.export.part,
          frames: self.props.ui.frames.total,
          animation: self.props.ui.export.animation,
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
        var img = canvas.toDataURL('image/'+self.props.ui.export.format),
            data = img.replace(/^data:image\/\w+;base64,/, ""),
            buf = new Buffer(data, 'base64'),
            target = this.props.file.folder+'/'+fileName+'.'+(self.props.ui.export.format === 'jpeg' ? 'jpg' : self.props.ui.export.format);

        fs.writeFile(target, buf);
      }

      canvas.forEach(function(canvas) {
        var fileName = this.props.file.name;
        if(self.props.ui.export.part === 'oneframe') fileName+= '-frame-'+self.props.ui.export.frame;
        else if(self.props.ui.export.part === 'allframes') {
          fileName+= '-frame-'+frame;
          frame++;
        }
        saveCanvas(canvas, fileName);
      });

      channel.gui.publish('export.finished', {
        folder: this.props.file.folder,
        name: this.props.file.name,
        format: this.props.ui.export.format,
        part: this.props.ui.export.part,
        frames: this.props.ui.frames.total,
      });
    }
  },
});