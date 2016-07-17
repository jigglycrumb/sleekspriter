var PlatformUtils = function() {
  console.log('Initializing PlatformUtils...');

  this.device = 'tablet';
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

  var self = this;

  fullPath = "file:///storage/emulated/0/Download/coin.pixels";

  console.log('PlatformUtils.loadFile', fullPath);

  //cordova.file.externalApplicationStorageDirectory

  // var fileEntry;

  function onSuccess(fileEntry) {
      console.log(fileEntry.name);

      console.log('got fileentry', fileEntry);
      fileEntry.file(function(file) {
          var reader = new window.FileReader();
          reader.onloadend = init.bind(fileEntry);
          reader.onerror = function(evt) {console.log('file load error', evt.target.result);};
          reader.readAsText(file);
      }, function(e) { console.log(e); });
  }

  function init(e) {
    console.log('init', this);

    var suffix = '.pixels',
        contents = e.target.result;

    var data = {
      json: JSON.parse(contents),
      path: fullPath,
      name: this.name.substring(0, this.name.length - suffix.length),
      folder: fullPath.substring(0, fullPath.length - this.name.length),
    };

    console.log('data:', data);

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
  }

  window.resolveLocalFileSystemURL(fullPath, onSuccess, null);
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
  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    console.log('PlatformUtils.boot');
    console.log(cordova.file);
    // console.log(device);

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
  }
};

PlatformUtils.prototype.setWindowTitle = function(title) {
  console.log('PlatformUtils.setWindowTitle', title);
};
