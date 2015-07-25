var PlatformUtils = function() {
  console.log('Initializing PlatformUtils');
};

PlatformUtils.prototype = {};
PlatformUtils.prototype.constructor = PlatformUtils;

// desktop file handlers

PlatformUtils.prototype.showOpenFileDialog = function() {
  document.querySelector('#fileOpen').click();
};

PlatformUtils.prototype.loadFile = function(fullPath) {

  console.info('loading file', fullPath);

  var fs = require('fs'),
      p = require('path'),
      self = this;

  fs.readFile(fullPath, function(error, contents) {
    if (error) throw error;

    var data = {
      json: JSON.parse(contents),
      path: fullPath,
      name: p.basename(fullPath, '.pixels'),
      folder: p.dirname(fullPath),
    };

    self.updateDefaultFolder();
    flux.actions.fileLoad(data);
    flux.actions.tabSelect('paint');
    flux.actions.frameSelect(1);
  });
};

PlatformUtils.prototype.showSaveFileDialog = function() {
  document.querySelector('#fileSave').click();
};

/*
PlatformUtils.prototype.saveFile = function() {

  if(this.path === null) return this.showSaveFileDialog();

  console.info('saving file', this.path);

  var fs = require('fs'),
      self = this;

  fs.writeFile(this.path, this.toJSONString(), function(error) {
    if (error) throw error;
  });
};

PlatformUtils.prototype.saveFileAs = function(fullPath) {
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
*/

PlatformUtils.prototype.updateDefaultFolder = function(folder) {
  if(!folder) {
    folder = process.env[(process.platform == 'win32' || process.platform == 'win64') ? 'USERPROFILE' : 'HOME'];
  }

  document.querySelector('#fileOpen').setAttribute('nwworkingdir', folder);
  document.querySelector('#fileSave').setAttribute('nwworkingdir', folder);
};