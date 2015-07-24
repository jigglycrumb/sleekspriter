function fileLoad(fullPath) {
  console.info('loading file', fullPath);

  var fs = require('fs'),
      p = require('path'),
      self = this;

  fs.readFile(fullPath, function(error, contents) {
    if (error) throw error;

    var json = JSON.parse(contents);

    /*
    self.fromJSON(json);
    self.path = fullPath;
    self.name = p.basename(fullPath, '.pixels');
    self.folder = p.dirname(fullPath);
    self._updateWorkingDir();

    channel.gui.publish('frame.select', {frame: 1});
    channel.gui.publish('screen.select', {target: 'paint'});
    */
  });
}




window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

React.render(React.createElement(App, {editor: editor, workspace: workspace, flux: flux}), container, function() {
  // show app window after GUI is rendered
  require('nw.gui').Window.get().show();
});

// setup nwjs file load/save hidden inputs
file._updateWorkingDir();

// bind file input change handlers
document.getElementById('fileOpen').addEventListener('change', function (e) {
  channel.file.publish('load', {path: this.value});
}, false);

document.getElementById('fileSave').addEventListener('change', function (e) {
  channel.file.publish('save.as', {path: this.value});
}, false);