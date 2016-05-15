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
  console.log('PlatformUtils.loadFile', fullPath);

  //cordova.file.externalApplicationStorageDirectory

  function onSuccess(fileEntry) {
      console.log(fileEntry.name);

      console.log('got fileentry', fileEntry);
      fileEntry.file(function(file) {
          var reader = new window.FileReader();
          reader.onloadend = function(evt) {console.log('file loaded', evt.target.result);};
          reader.onerror = function(evt) {console.log('file load error', evt.target.result);};
          reader.readAsText(file);
      }, function(e){console.log(e);});
  }

  window.resolveLocalFileSystemURL("file:///storage/emulated/0/Download/coin.pixels", onSuccess, null);
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
