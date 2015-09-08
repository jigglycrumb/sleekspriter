var PlatformUtils = function() {};

PlatformUtils.prototype = {};
PlatformUtils.prototype.constructor = PlatformUtils;

// desktop file handlers

PlatformUtils.prototype.showOpenFileDialog = function() {
  document.querySelector('#fileOpen').click();
};

PlatformUtils.prototype.showSaveFileDialog = function() {
  document.querySelector('#fileSave').click();
};

PlatformUtils.prototype.loadFile = function(fullPath) {

  console.info('loading file', fullPath);

  var fs = require('fs'),
      p = require('path'),
      self = this;

  fs.readFile(fullPath, function(error, contents) {
    if(error) throw error;

    var data = {
      json: JSON.parse(contents),
      path: fullPath,
      name: p.basename(fullPath, '.pixels'),
      folder: p.dirname(fullPath),
    };

    self.updateDefaultFolder();
    flux.actions.fileLoad(data);
    flux.actions.tabSelect('paint');

    // actions to init paint screen
    flux.actions.frameSelect(1);
    flux.actions.layerTopSelect();
    flux.actions.scopeSet(null, 'layer');

    // actions to init export screen
    if(flux.stores.FileStore.getData().animations.length > 0) {
      flux.actions.exportAnimation(flux.stores.FileStore.getData().animations[0].id);
    }
  });
};

PlatformUtils.prototype.showSaveFileDialog = function() {
  document.querySelector('#fileSave').click();
};

PlatformUtils.prototype.saveFile = function(json) {

  var path = flux.stores.FileStore.getData().path;

  if(path === null) return this.showSaveFileDialog();

  console.info('saving file', path);

  var fs = require('fs');

  fs.writeFile(path, json, function(error) {
    if (error) throw error;
  });
};

PlatformUtils.prototype.saveFileAs = function(fullPath, json) {
  var fs = require('fs'),
      p = require('path'),
      self = this;

  if(p.extname(fullPath) !== '.pixels') fullPath+= '.pixels';

  console.info('saving file AS', fullPath, json);

  fs.writeFile(fullPath, json, function(error) {
    if (error) throw error;

    // TODO: set these in FileStore
    // self.path = fullPath;
    // self.name = p.basename(fullPath, '.pixels');
    // self.folder = p.dirname(fullPath);
    self.updateDefaultFolder();
  });
};

PlatformUtils.prototype.updateDefaultFolder = function(folder) {
  if(!folder) {
    folder = process.env[(process.platform == 'win32' || process.platform == 'win64') ? 'USERPROFILE' : 'HOME'];
  }

  document.querySelector('#fileOpen').setAttribute('nwworkingdir', folder);
  document.querySelector('#fileSave').setAttribute('nwworkingdir', folder);
};