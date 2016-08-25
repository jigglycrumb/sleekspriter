var PlatformUtils = function() {
  console.log('Initializing PlatformUtils...');

  this.device = 'browser';
};

PlatformUtils.prototype = {};
PlatformUtils.prototype.constructor = PlatformUtils;

PlatformUtils.prototype.showOpenFileDialog = function() {
  flux.actions.modalShow(ModalLoadFile);
};

PlatformUtils.prototype.showSaveFileDialog = function() {
  flux.actions.modalShow(ModalSaveFile);
};

PlatformUtils.prototype.loadFile = function(json) {
  var data = {
    json: json, // the file content parsed as JSON
    path: '/unnamed.pixels',             // the complete absolute file path
    name: 'unnamed.pixels', // the file name without extension, e.g. "coin"
    folder: '/', // the complete absolute folder (same as path without the file name)
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

PlatformUtils.prototype.exportFile = function(settings) {
  console.log('PlatformUtils.exportFile', settings);

  var self = this,
      finishedStatusText = 'Export finished';

  writeImages();

  function writeImages() {
    var canvas = document.getElementById('ExportPreview').querySelectorAll('.preview canvas')[0],
        frame = 1,
        img = canvas.toDataURL('image/'+settings.ui.export.format);

    flux.actions.exportStatus(finishedStatusText);
    window.open(img);
  }
};

PlatformUtils.prototype.updateDefaultFolder = function(folder) {
  console.log('PlatformUtils.updateDefaultFolder', folder);
};

PlatformUtils.prototype.getPathData = function(fullPath) {
  console.log('PlatformUtils.getPathData', fullPath);
};

PlatformUtils.prototype.boot = function() {
  console.log('PlatformUtils.boot');

  var palettesFile = 'json/palettes.json';
  var request = new XMLHttpRequest();

  request.open("GET", palettesFile);
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      window.onresize = flux.actions.windowResize;
      screen.onorientationchange = flux.actions.windowResize;

      setupFluxDispatcher();

      ReactDOM.render(React.createElement(App, {flux: flux}), container);

      var json = JSON.parse(request.responseText);
      flux.actions.paletteLoad(json);

      // menu_init();

      setTimeout(flux.actions.windowResize, 250);
    }
  };

  request.send();
};

PlatformUtils.prototype.setWindowTitle = function(title) {
  document.title = title;
};


var platformUtils = new PlatformUtils();
// module.exports = new PlatformUtils();
