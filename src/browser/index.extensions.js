// file.load('coin.pixels', fileLoaded);

function fileLoaded(json) {
  // init file
  file.fromJSON(json);
  // select last selected frame
  channel.gui.publish('frame.select', {frame: editor.frames.selected});
}

React.render(React.createElement(App, {editor: editor, workspace: workspace, flux: flux}), container);