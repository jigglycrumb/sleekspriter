
// import node requirements
var gui = require('nw.gui');
var win = gui.Window.get();
var windowMenu = new gui.Menu({ type: "menubar" });

// create file submenu
var fileMenu = new gui.Menu();
win.menu.insert(new gui.MenuItem({label: 'File', submenu: fileMenu}), 1);

fileMenu.insert(new gui.MenuItem({
  label: 'New',
  click: function() {
    channel.publish('modal.show', {component: ModalNewFile});
  },
  key: 'n',
  modifiers: 'cmd'
}), 0);

fileMenu.insert(new gui.MenuItem({
  label: 'Open',
  click: function() {
    clickInput('fileOpen');
  },
  key: 'o',
  modifiers: 'cmd'
}), 1);

fileMenu.insert(new gui.MenuItem({
  label: 'Save',
  click: function() {
    if(file.path === null) clickInput('fileSave');
    else file.save();
  },
  key: 's',
  modifiers: 'cmd',
  enabled: false,
}), 2);

fileMenu.insert(new gui.MenuItem({
  label: 'Save as',
  click: function() {
    clickInput('fileSave');
  },
  key: 's',
  modifiers: 'shift-cmd',
  enabled: false,
}), 3);

// create selection menu
var selectionMenu = new gui.Menu();
win.menu.insert(new gui.MenuItem({label: 'Select', submenu: selectionMenu}), 2);

selectionMenu.insert(new gui.MenuItem({
  label: 'All',
  click: function() {
    var start = new Point(1, 1),
        end = new Point(file.size.width, file.size.height);

    channel.publish('selection.clear');
    channel.publish('selection.start', {point: start});
    channel.publish('selection.end', {point: end});
  },
  key: 'a',
  modifiers: 'cmd',
  enabled: false,
}), 0);

selectionMenu.insert(new gui.MenuItem({
  label: 'Deselect',
  click: function() {
    channel.publish('selection.clear');
  },
  key: 'd',
  modifiers: 'cmd',
  enabled: false,
}), 1);

// create layer menu
var layerMenu = new gui.Menu();
win.menu.insert(new gui.MenuItem({label: 'Layer', submenu: layerMenu}), 3);

layerMenu.insert(new gui.MenuItem({
  label: 'Merge with layer above',
  click: function() {
    console.log('merge with above');
  },
  key: 'e',
  modifiers: 'shift-cmd',
  enabled: false,
}), 0);

layerMenu.insert(new gui.MenuItem({
  label: 'Merge with layer below',
  click: function() {
    console.log('merge with below');
  },
  key: 'e',
  modifiers: 'cmd',
  enabled: false,
}), 1);

channel.subscribe('file.load', function() {
  function enable(item) { item.enabled = true; }
  fileMenu.items.map(enable);
  selectionMenu.items.map(enable);
  layerMenu.items.map(enable);
});

// Create a separator
// item = new gui.MenuItem({ type: 'separator' });