var Utils = function() {};

Utils.prototype = Object.create(null);
Utils.prototype.constructor = Utils;

Utils.prototype.loadFileFromJSON = function(name, folder, json) {
  var data = {
    json: json, // the file content parsed as JSON
    path: folder + '/' + name + '.pixels',             // the complete absolute file path
    name: name + '.pixels', // the file name without extension, e.g. "coin"
    folder: folder, // the complete absolute folder (same as path without the file name)
  };

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
};


module.exports = new Utils();
