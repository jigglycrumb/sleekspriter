window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

React.render(React.createElement(App, {editor: editor, workspace: workspace}), container, function() {
  // show app window after GUI is rendered
  require('nw.gui').Window.get().show();
});

// setup nwjs file load/save hidden inputs
file._updateWorkingDir();

// bind file input change handlers
document.getElementById('fileOpen').addEventListener('change', function (e) {
  channel.file.publish('load', {path: this.value});
}, false);

document.getElementById('fileSave').addEventListener('change', function (e) {
  channel.file.publish('save.as', {path: this.value});
}, false);

/* only for debugging */

function tools() {
  require('nw.gui').Window.get().showDevTools();
}

function reload() {
  require('nw.gui').Window.get().reloadDev();
}