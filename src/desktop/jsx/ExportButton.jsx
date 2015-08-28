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
        sys = require('sys'),
        path = require('path'),
        finishedStatusText;

    if(this.props.file.folder === null) {
      this.getFlux().actions.modalShow(ModalErrorSaveBeforeExport);
      return;
    }

    switch(this.props.ui.export.part) {
      case 'animation':
        var animation = storeUtils.animations.getById(this.props.ui.export.animation);
        finishedStatusText = 'Exported to '+this.props.file.folder+path.sep+this.props.file.name+'-'+animation.name+'.gif';
        writeAnimation();
        break;

      case 'allframes':
        finishedStatusText = 'Exported '+self.props.ui.frames.total+' frames as '+(this.props.ui.export.format === 'jpeg' ? 'jpg' : this.props.ui.export.format)+' to '+this.props.file.folder;
        writeImages();
        break;

      default:
        finishedStatusText = 'Exported to '+this.props.file.folder+path.sep+this.props.file.name+'.'+(this.props.ui.export.format === 'jpeg' ? 'jpg' : this.props.ui.export.format);
        writeImages();
        break;
    }

    function writeAnimation() {
      var gif = new GIF({
                      workers: 2,
                      quality: 1,
                      // background: '#ff0000',
                      transparent: 0x000000,
                    }),
          canvas = NodeList2Array(document.getElementById('ExportPreview').querySelector('.animation-frames').querySelectorAll('.preview')),
          delay = 1000/animation.fps;

      canvas.forEach(function(canvas) {
        gif.addFrame(canvas, {delay: delay});
      });

      gif.on('finished', exportGif);
      gif.render();

      function exportGif(blob) {
       var reader = new FileReader();
       reader.onload = writeGif;
       reader.readAsDataURL(blob);
      }

      function writeGif(e) {
        var data = e.target.result.replace(/^data:image\/\w+;base64,/, ""),
            buf = new Buffer(data, 'base64'),
            target = self.props.file.folder+'/'+self.props.file.name+'-'+self.props.ui.export.animation+'.gif';

        fs.writeFile(target, buf);

        self.getFlux().actions.exportStatus(finishedStatusText);
      }
    }


    function writeImages() {
      var canvas = NodeList2Array(document.getElementById('ExportPreview').querySelectorAll('.preview')),
          frame = 1;

      function saveCanvas(canvas, fileName) {
        var img = canvas.toDataURL('image/'+self.props.ui.export.format),
            data = img.replace(/^data:image\/\w+;base64,/, ""),
            buf = new Buffer(data, 'base64'),
            target = self.props.file.folder+'/'+fileName+'.'+(self.props.ui.export.format === 'jpeg' ? 'jpg' : self.props.ui.export.format);

        fs.writeFile(target, buf);
      }

      canvas.forEach(function(canvas) {
        var fileName = self.props.file.name;
        if(self.props.ui.export.part === 'oneframe') fileName+= '-frame-'+self.props.ui.export.frame;
        else if(self.props.ui.export.part === 'allframes') {
          fileName+= '-frame-'+frame;
          frame++;
        }
        saveCanvas(canvas, fileName);
      });

      self.getFlux().actions.exportStatus(finishedStatusText);
    }

  },
});