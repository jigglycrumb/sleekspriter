// define keyboard mod key
var modKey = process.platform === 'darwin' ? 'cmd' : 'ctrl';

// import node requirements
var gui = require('nw.gui');
var menuBar = new gui.Menu({ type: "menubar" });

if(process.platform === 'darwin') {
  // create default mac menu
  menuBar.createMacBuiltin("@@app", {
    hideEdit: true,
    hideWindow: true
  });
}

// create file submenu
var fileMenu = new gui.Menu();
menuBar.append(new gui.MenuItem({label: 'File', submenu: fileMenu}));

fileMenu.append(new gui.MenuItem({
  label: 'New',
  click: function() {
    channel.publish('modal.show', {component: ModalNewFile});
  },
  key: 'n',
  modifiers: modKey,
}));

fileMenu.append(new gui.MenuItem({
  label: 'Open',
  click: function() {
    clickInput('fileOpen');
  },
  key: 'o',
  modifiers: modKey,
}));

fileMenu.append(new gui.MenuItem({
  label: 'Save',
  click: function() {
    if(file.path === null) clickInput('fileSave');
    else file.save();
  },
  key: 's',
  modifiers: modKey,
  enabled: false,
}));

fileMenu.append(new gui.MenuItem({
  label: 'Save as',
  click: function() {
    clickInput('fileSave');
  },
  key: 's',
  modifiers: 'shift-'+modKey,
  enabled: false,
}));

// append "quit" menu option to windows menu
if(process.platform === 'win32') {
  // Create a separator
  fileMenu.append(new gui.MenuItem({ type: 'separator' }));
  fileMenu.append(new gui.MenuItem({
    label: 'Quit',
    click: function() {
      gui.App.quit();
    },
    key: 'q',
    modifiers: modKey,
  }));
}

// create selection menu
var selectionMenu = new gui.Menu();
menuBar.append(new gui.MenuItem({label: 'Select', submenu: selectionMenu}));

selectionMenu.append(new gui.MenuItem({
  label: 'All',
  click: function() {
    var start = new Point(1, 1),
        end = new Point(file.size.width, file.size.height);

    channel.publish('selection.clear');
    channel.publish('selection.start', {point: start});
    channel.publish('selection.end', {point: end});
  },
  key: 'a',
  modifiers: modKey,
  enabled: false,
}));

selectionMenu.append(new gui.MenuItem({
  label: 'Deselect',
  click: function() {
    channel.publish('selection.clear');
  },
  key: 'd',
  modifiers: modKey,
  enabled: false,
}));

// create layer menu
var layerMenu = new gui.Menu();
menuBar.append(new gui.MenuItem({label: 'Layer', submenu: layerMenu}));

layerMenu.append(new gui.MenuItem({
  label: 'Merge with layer above',
  click: function() {
    console.log('merge with above');
  },
  key: 'e',
  modifiers: 'shift-'+modKey,
  enabled: false,
}));

layerMenu.append(new gui.MenuItem({
  label: 'Merge with layer below',
  click: function() {
    console.log('merge with below');
  },
  key: 'e',
  modifiers: modKey,
  enabled: false,
}));

channel.subscribe('file.load', function() {
  function enable(item) { item.enabled = true; }
  fileMenu.items.map(enable);
  selectionMenu.items.map(enable);
  layerMenu.items.map(enable);
});

gui.Window.get().menu = menuBar;