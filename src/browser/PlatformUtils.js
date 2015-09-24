var PlatformUtils = function() {
  console.log('Initializing PlatformUtils...');
};

PlatformUtils.prototype = {};
PlatformUtils.prototype.constructor = PlatformUtils;

PlatformUtils.prototype.showOpenFileDialog = function() {
  console.log('PlatformUtils.showOpenFileDialog');
};

PlatformUtils.prototype.showSaveFileDialog = function() {
  console.log('PlatformUtils.showSaveFileDialog');
};

PlatformUtils.prototype.loadFile = function(fullPath) {
  console.log('PlatformUtils.loadFile', fullPath);
};

PlatformUtils.prototype.exportFile = function(settings) {
  console.log('PlatformUtils.exportFile', settings);
};

PlatformUtils.prototype.saveFile = function(json) {
  console.log('PlatformUtils.saveFile', json);
};

PlatformUtils.prototype.updateDefaultFolder = function(folder) {
  console.log('PlatformUtils.updateDefaultFolder', folder);
};

PlatformUtils.prototype.getPathData = function(fullPath) {
  console.log('PlatformUtils.getPathData', fullPath);
};

PlatformUtils.prototype.boot = function() {
  console.log('PlatformUtils.boot');
};

PlatformUtils.prototype.setWindowTitle = function(title) {
  console.log('PlatformUtils.setWindowTitle', title);
};