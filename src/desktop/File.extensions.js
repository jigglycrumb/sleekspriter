// desktop file handlers

File.prototype.showOpenFileDialog = function() {
  document.querySelector('#fileOpen').click();
};

File.prototype.load = function(fullPath) {

  console.info('loading file', fullPath);

  var fs = require('fs'),
      p = require('path'),
      self = this;

  fs.readFile(fullPath, function(error, contents) {
    if (error) throw error;

    var json = JSON.parse(contents);
    self.fromJSON(json);
    self.path = fullPath;
    self.name = p.basename(fullPath, '.pixels');
    self.folder = p.dirname(fullPath);
    self._updateWorkingDir();

    channel.gui.publish('frame.select', {frame: 1});
    channel.gui.publish('screen.select', {target: 'paint'});
  });
};

File.prototype.showSaveFileDialog = function() {
  document.querySelector('#fileSave').click();
};

File.prototype.save = function() {

  if(this.path === null) return this.showSaveFileDialog();

  console.info('saving file', this.path);

  var fs = require('fs'),
      self = this;

  fs.writeFile(this.path, this.toJSONString(), function(error) {
    if (error) throw error;
  });
};

File.prototype.saveAs = function(fullPath) {
  var fs = require('fs'),
      p = require('path'),
      self = this;

  if(p.extname(fullPath) !== '.pixels') fullPath+= '.pixels';

  console.info('saving file AS', fullPath);

  fs.writeFile(fullPath, this.toJSONString(), function(error) {
    if (error) throw error;
    self.path = fullPath;
    self.name = p.basename(fullPath, '.pixels');
    self.folder = p.dirname(fullPath);
    self._updateWorkingDir();
  });
};


File.prototype._updateWorkingDir = function() {
  var workingDir = this.folder;

  if(workingDir === null) {
    workingDir = process.env[(process.platform == 'win32' || process.platform == 'win64') ? 'USERPROFILE' : 'HOME'];
  }

  document.querySelector('#fileOpen').setAttribute('nwworkingdir', workingDir);
  document.querySelector('#fileSave').setAttribute('nwworkingdir', workingDir);
};