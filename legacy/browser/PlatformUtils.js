var PlatformUtils = function() {
  console.log("Initializing PlatformUtils...");
  this.device = "browser";
};

PlatformUtils.prototype = {};
PlatformUtils.prototype.constructor = PlatformUtils;

PlatformUtils.prototype.exportFile = function(settings) {
  console.log("PlatformUtils.exportFile", settings);

  var self = this,
    finishedStatusText = "Export finished";

  writeImages();

  function writeImages() {
    var canvas = document
        .getElementById("ExportPreview")
        .querySelectorAll(".preview canvas")[0],
      frame = 1,
      img = canvas.toDataURL("image/" + settings.ui.export.format);

    flux.actions.exportStatus(finishedStatusText);
    window.open(img);
  }
};

var platformUtils = new PlatformUtils();
// module.exports = new PlatformUtils();
