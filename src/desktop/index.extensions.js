function platform_init() {
  window.ondragover = function(e) { e.preventDefault(); return false };
  window.ondrop = function(e) { e.preventDefault(); return false };

  React.render(React.createElement(App, {flux: flux}), container, function() {
    // show app window after GUI is rendered
    require('nw.gui').Window.get().show();
  });

  // setup nwjs file load/save hidden inputs
  platformUtils.updateDefaultFolder();

  // bind file input change handlers
  document.getElementById('fileOpen').addEventListener('change', function (e) {
    platformUtils.loadFile(this.value);
  }, false);

  document.getElementById('fileSave').addEventListener('change', function (e) {
    channel.file.publish('save.as', {path: this.value});
  }, false);
}