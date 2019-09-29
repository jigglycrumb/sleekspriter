var PlatformUtils = function(callback) {
  this.callback = callback;

  this.device = "desktop";
};

PlatformUtils.prototype = {};
PlatformUtils.prototype.constructor = PlatformUtils;

// desktop file handlers

PlatformUtils.prototype.exportFile = function(settings) {
  var self = this,
    fs = require("fs"),
    sys = require("sys"),
    path = require("path"),
    finishedStatusText;

  if (settings.file.folder === null) {
    flux.actions.modalShow(ModalErrorSaveBeforeExport);
    return;
  }

  switch (settings.ui.export.part) {
    case "animation":
      var animation = storeUtils.animations.getById(
        settings.ui.export.animation
      );
      finishedStatusText =
        "Exported to " +
        settings.file.folder +
        path.sep +
        settings.file.name +
        "-" +
        animation.name +
        ".gif";
      writeAnimation();
      break;

    case "allframes":
      finishedStatusText =
        "Exported " +
        settings.ui.frames.total +
        " frames as " +
        (settings.ui.export.format === "jpeg"
          ? "jpg"
          : settings.ui.export.format) +
        " to " +
        settings.file.folder;
      writeImages();
      break;

    default:
      finishedStatusText =
        "Exported to " +
        settings.file.folder +
        path.sep +
        settings.file.name +
        "." +
        (settings.ui.export.format === "jpeg"
          ? "jpg"
          : settings.ui.export.format);
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
      canvas = NodeList2Array(
        document
          .getElementById("ExportPreview")
          .querySelector(".animation-frames")
          .querySelectorAll(".preview canvas")
      ),
      delay = 1000 / animation.fps;

    canvas.forEach(function(canvas) {
      gif.addFrame(canvas, { delay: delay });
    });

    gif.on("finished", exportGif);
    gif.render();

    function exportGif(blob) {
      var reader = new FileReader();
      reader.onload = writeGif;
      reader.readAsDataURL(blob);
    }

    function writeGif(e) {
      var data = e.target.result.replace(/^data:image\/\w+;base64,/, ""),
        buf = new Buffer(data, "base64"),
        target =
          settings.file.folder +
          "/" +
          settings.file.name +
          "-" +
          settings.ui.export.animation +
          ".gif";

      fs.writeFile(target, buf);

      flux.actions.exportStatus(finishedStatusText);
    }
  }

  function writeImages() {
    var canvas = NodeList2Array(
        document
          .getElementById("ExportPreview")
          .querySelectorAll(".preview canvas")
      ),
      frame = 1;

    function saveCanvas(canvas, fileName) {
      var img = canvas.toDataURL("image/" + settings.ui.export.format),
        data = img.replace(/^data:image\/\w+;base64,/, ""),
        buf = new Buffer(data, "base64"),
        target =
          settings.file.folder +
          "/" +
          fileName +
          "." +
          (settings.ui.export.format === "jpeg"
            ? "jpg"
            : settings.ui.export.format);

      fs.writeFile(target, buf);
    }

    canvas.forEach(function(canvas) {
      var fileName = settings.file.name;
      if (settings.ui.export.part === "oneframe")
        fileName += "-frame-" + settings.ui.export.frame;
      else if (settings.ui.export.part === "allframes") {
        fileName += "-frame-" + frame;
        frame++;
      }
      saveCanvas(canvas, fileName);
    });

    flux.actions.exportStatus(finishedStatusText);
  }
};

PlatformUtils.prototype.boot = function() {
  window.ondragover = function(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  };
  window.ondrop = function(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  };
  window.onresize = flux.actions.windowResize;

  // setup nwjs file load/save hidden inputs
  this.updateDefaultFolder();

  // bind file input change handlers
  document.getElementById("fileOpen").addEventListener(
    "change",
    function(e) {
      platformUtils.loadFile(this.value);
    },
    false
  );

  document.getElementById("fileSave").addEventListener(
    "change",
    function(e) {
      flux.actions.fileSaveAs(this.value);
    },
    false
  );

  // read palettes from json file and start App
  var fs = require("fs");
  fs.readFile("json/palettes.json", function(error, contents) {
    if (error) throw error;

    setupFluxDispatcher();

    ReactDOM.render(
      React.createElement(App, { flux: flux }),
      container,
      function() {
        // show app window after GUI is rendered
        require("nw.gui")
          .Window.get()
          .show();
      }
    );

    var json = JSON.parse(contents);
    flux.actions.paletteLoad(json);

    initializeDesktopMenu();

    flux.actions.windowResize();
  });
};

var platformUtils = new PlatformUtils();
