// define keyboard mod key
var modKey = process.platform === 'darwin' ? 'cmd' : 'ctrl';

var gui = require('nw.gui');
var menuBar = new gui.Menu({ type: "menubar" });
var creditsWindow;

function showCredits() {
  console.log('showCredits');

  creditsWindow = gui.Window.open('credits.html', {
    "title": "About @@name",
    // "icon": "link.png",
    "toolbar": false,
    // "frame": false,
    "width": 500,
    "height": 375,
    "position": "center",
    "resizable": false,
  });
}

function closeCredits() {
  creditsWindow.close();
}

if(process.platform === 'darwin') {
  // create default mac menu
  menuBar.createMacBuiltin("@@name", {
    hideEdit: true,
    hideWindow: true
  });
}

//------------------------------------------------------------------------------
// create "File" menu
var fileMenu = new gui.Menu();
menuBar.append(new gui.MenuItem({label: 'File', submenu: fileMenu}));

fileMenu.append(new gui.MenuItem({
  label: 'New',
  click: function() {
    if(flux.stores.UiStore.getData().tab === 'start') {
      flux.actions.selectTab('paint');
    }
    flux.actions.modalShow(ModalNewFile);
  },
  key: 'n',
  modifiers: modKey,
}));

fileMenu.append(new gui.MenuItem({
  label: 'Open',
  click: function() {
    platformUtils.showOpenFileDialog();
  },
  key: 'o',
  modifiers: modKey,
}));

fileMenu.append(new gui.MenuItem({
  label: 'Save',
  click: function() {
    channel.file.publish('save');
  },
  key: 's',
  modifiers: modKey,
  enabled: false,
}));

fileMenu.append(new gui.MenuItem({
  label: 'Save as',
  click: function() {
    channel.file.publish('path.set');
  },
  key: 's',
  modifiers: 'shift-'+modKey,
  enabled: false,
}));

fileMenu.append(new gui.MenuItem({ type: 'separator' }));

fileMenu.append(new gui.MenuItem({
  label: 'Close',
  click: function() {
    channel.file.publish('close');
  },
  key: 'w',
  modifiers: modKey,
  enabled: false,
}));





// append "About" and "Quit" menu items to windows menu
if(process.platform === 'win32' || process.platform === 'win64') {

  fileMenu.append(new gui.MenuItem({ type: 'separator' }));
  fileMenu.append(new gui.MenuItem({
    label: 'About @@name',
    click: showCredits,
  }));

  fileMenu.append(new gui.MenuItem({ type: 'separator' }));
  fileMenu.append(new gui.MenuItem({
    label: 'Quit @@name',
    click: gui.App.quit,
    key: 'q',
    modifiers: modKey,
  }));
}

//------------------------------------------------------------------------------
// create "Edit" menu
var editMenu = new gui.Menu();
menuBar.append(new gui.MenuItem({label: 'Edit', submenu: editMenu}));

editMenu.append(new gui.MenuItem({
  label: 'Cut',
  click: function() {
    channel.gui.publish('scope.cut');
  },
  key: 'x',
  modifiers: modKey,
  enabled: false,
}));

editMenu.append(new gui.MenuItem({
  label: 'Copy',
  click: function() {
    channel.gui.publish('scope.copy');
  },
  key: 'c',
  modifiers: modKey,
  enabled: false,
}));

editMenu.append(new gui.MenuItem({
  label: 'Paste',
  click: function() {
    channel.gui.publish('scope.paste');
  },
  key: 'v',
  modifiers: modKey,
  enabled: false,
}));

editMenu.append(new gui.MenuItem({
  label: 'Delete',
  click: function() {
    channel.gui.publish('scope.delete');
  },
  key: String.fromCharCode(8),
  enabled: false,
}));

editMenu.append(new gui.MenuItem({ type: 'separator' }));

editMenu.append(new gui.MenuItem({
  label: 'Flip Horizontal',
  click: function() {
    channel.gui.publish('scope.flip.horizontal');
  },
  enabled: false,
}));

editMenu.append(new gui.MenuItem({
  label: 'Flip Vertical',
  click: function() {
    channel.gui.publish('scope.flip.vertical');
  },
  enabled: false,
}));

editMenu.append(new gui.MenuItem({ type: 'separator' }));

editMenu.append(new gui.MenuItem({
  label: 'Image size...',
  click: function() {
    channel.gui.publish('modal.show', {component: ModalEditImageSize});
  },
  key: 'i',
  modifiers: modKey,
  enabled: false,
}));

//------------------------------------------------------------------------------
// create "Select" menu
var selectMenu = new gui.Menu();
menuBar.append(new gui.MenuItem({label: 'Select', submenu: selectMenu}));

selectMenu.append(new gui.MenuItem({
  label: 'All',
  click: function() {
    var start = new Point(1, 1),
        end = new Point(file.size.width, file.size.height);

    channel.gui.publish('selection.clear');
    channel.gui.publish('selection.start', {point: start});
    channel.gui.publish('selection.end', {point: end});
  },
  key: 'a',
  modifiers: modKey,
  enabled: false,
}));

selectMenu.append(new gui.MenuItem({
  label: 'Deselect',
  click: function() {
    channel.gui.publish('selection.clear');
  },
  key: 'd',
  modifiers: modKey,
  enabled: false,
}));


//------------------------------------------------------------------------------
// create "Layer" menu
var layerMenu = new gui.Menu();
menuBar.append(new gui.MenuItem({label: 'Layer', submenu: layerMenu}));

layerMenu.append(new gui.MenuItem({
  label: 'Merge with layer above',
  click: function() {
    var data = {
      top: editor.layers.getAboveSelected(),
      bottom: editor.layers.getSelected(),
    };
    if(data.top) channel.gui.publish('layer.merge', data);
  },
  key: 'e',
  modifiers: 'shift-'+modKey,
  enabled: false,
}));

layerMenu.append(new gui.MenuItem({
  label: 'Merge with layer below',
  click: function() {
    var data = {
      top: editor.layers.getSelected(),
      bottom: editor.layers.getBelowSelected(),
    };
    if(data.bottom) channel.gui.publish('layer.merge', data);
  },
  key: 'e',
  modifiers: modKey,
  enabled: false,
}));


//------------------------------------------------------------------------------
// create "Frame" menu
var frameMenu = new gui.Menu();
menuBar.append(new gui.MenuItem({label: 'Frame', submenu: frameMenu}));

frameMenu.append(new gui.MenuItem({
  label: 'Rotate 180°',
  click: function() {
    // channel.gui.publish('frame.flip.horizontal');
    alert('not yet, sorry');
  },
  enabled: false,
}));

frameMenu.append(new gui.MenuItem({
  label: 'Rotate 90° CW',
  click: function() {
    // channel.gui.publish('frame.flip.horizontal');
    alert('not yet, sorry');
  },
  enabled: false,
}));

frameMenu.append(new gui.MenuItem({
  label: 'Rotate 90° CCW',
  click: function() {
    // channel.gui.publish('frame.flip.horizontal');
    alert('not yet, sorry');
  },
  enabled: false,
}));

frameMenu.append(new gui.MenuItem({ type: 'separator' }));

frameMenu.append(new gui.MenuItem({
  label: 'Flip Horizontal',
  click: function() {
    channel.gui.publish('frame.flip.horizontal');
  },
  enabled: false,
}));

frameMenu.append(new gui.MenuItem({
  label: 'Flip Vertical',
  click: function() {
    channel.gui.publish('frame.flip.vertical');
  },
  enabled: false,
}));

//------------------------------------------------------------------------------
// create "Developer" menu
var developerMenu = new gui.Menu();
menuBar.append(new gui.MenuItem({label: 'Developer', submenu: developerMenu}));

developerMenu.append(new gui.MenuItem({
  label: 'Open Developer Tools',
  click: function() {
    require('nw.gui').Window.get().showDevTools();
  }
}));

developerMenu.append(new gui.MenuItem({
  label: 'Reload Application',
  click: function() {
    require('nw.gui').Window.get().reloadDev();
  }
}));

developerMenu.append(new gui.MenuItem({
  label: 'Show Debug Screen',
  click: function() {
    console.log('logscreen');
    channel.gui.publish('screen.select', {target: 'debug'});
  }
}));


//------------------------------------------------------------------------------
// enable menus after file was loaded
channel.file.subscribe('file.load', function() {
  function enable(item) { item.enabled = true; }
  fileMenu.items.map(enable);
  editMenu.items.map(enable);
  selectMenu.items.map(enable);
  layerMenu.items.map(enable);
  frameMenu.items.map(enable);
});

// assign menu to window
gui.Window.get().menu = menuBar;