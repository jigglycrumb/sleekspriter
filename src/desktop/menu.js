// define keyboard mod key
var modKey = process.platform === 'darwin' ? 'cmd' : 'ctrl';

var gui = require('nw.gui');
var menuBar = new gui.Menu({ type: "menubar" });
var creditsWindow;

function showCredits() {
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

var menu = {};

function enableMenus(enabled) {
  function enable(item) { item.enabled = enabled; }
  for(x in menu) if(x !== 'developer') menu[x].items.map(enable);
}

//------------------------------------------------------------------------------

function menu_init() {

  if(process.platform === 'darwin') {
    // create default mac menu
    menuBar.createMacBuiltin("@@name", {
      hideEdit: true,
      hideWindow: true
    });
  }

  // create "File" menu
  menu.file = new gui.Menu();
  menuBar.append(new gui.MenuItem({label: 'File', submenu: menu.file}));

  menu.file.append(new gui.MenuItem({
    label: 'New',
    click: function() {
      if(flux.stores.UiStore.getData().tab === 'start') {
        flux.actions.tabSelect('paint');
      }
      flux.actions.modalShow(ModalNewFile);
    },
    key: 'n',
    modifiers: modKey,
  }));

  menu.file.append(new gui.MenuItem({
    label: 'Open',
    click: function() {
      platformUtils.showOpenFileDialog();
    },
    key: 'o',
    modifiers: modKey,
  }));

  menu.file.append(new gui.MenuItem({
    label: 'Save',
    click: function() {
      channel.file.publish('save');
    },
    key: 's',
    modifiers: modKey,
    enabled: false,
  }));

  menu.file.append(new gui.MenuItem({
    label: 'Save as',
    click: function() {
      channel.file.publish('path.set');
    },
    key: 's',
    modifiers: 'shift-'+modKey,
    enabled: false,
  }));

  menu.file.append(new gui.MenuItem({ type: 'separator' }));

  menu.file.append(new gui.MenuItem({
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

    menu.file.append(new gui.MenuItem({ type: 'separator' }));
    menu.file.append(new gui.MenuItem({
      label: 'About @@name',
      click: showCredits,
    }));

    menu.file.append(new gui.MenuItem({ type: 'separator' }));
    menu.file.append(new gui.MenuItem({
      label: 'Quit @@name',
      click: gui.App.quit,
      key: 'q',
      modifiers: modKey,
    }));
  }

  //------------------------------------------------------------------------------
  // create "Edit" menu
  menu.edit = new gui.Menu();
  menuBar.append(new gui.MenuItem({label: 'Edit', submenu: menu.edit}));

  menu.edit.append(new gui.MenuItem({
    label: 'Cut',
    click: function() {
      flux.actions.scopeCut();
    },
    key: 'x',
    modifiers: modKey,
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({
    label: 'Copy',
    click: function() {
      flux.actions.scopeCopy();
    },
    key: 'c',
    modifiers: modKey,
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({
    label: 'Paste',
    click: function() {
      flux.actions.scopePaste();
    },
    key: 'v',
    modifiers: modKey,
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({
    label: 'Delete',
    click: function() {
      flux.actions.scopeDelete();
    },
    key: String.fromCharCode(8),
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({ type: 'separator' }));

  menu.edit.append(new gui.MenuItem({
    label: 'Flip Horizontal',
    click: function() {
      channel.gui.publish('scope.flip.horizontal');
    },
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({
    label: 'Flip Vertical',
    click: function() {
      channel.gui.publish('scope.flip.vertical');
    },
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({ type: 'separator' }));

  menu.edit.append(new gui.MenuItem({
    label: 'Image size...',
    click: function() {
      flux.actions.modalShow(ModalEditImageSize);
    },
    key: 'i',
    modifiers: modKey,
    enabled: false,
  }));

  //------------------------------------------------------------------------------
  // create "Select" menu
  menu.select = new gui.Menu();
  menuBar.append(new gui.MenuItem({label: 'Select', submenu: menu.select}));

  menu.select.append(new gui.MenuItem({
    label: 'All',
    click: function() {
      var start = new Point(1, 1),
          end = new Point(file.size.width, file.size.height),
          layer = flux.stores.UiStore.getData().layers.selected;

      flux.actions.selectionClear();
      flux.actions.scopeSet(layer, 'layer', layer);
      flux.actions.selectionStart(start);
      flux.actions.selectionEnd(end);
      flux.actions.scopeSet(layer, 'selection', flux.stores.UiStore.getData().selection);
    },
    key: 'a',
    modifiers: modKey,
    enabled: false,
  }));

  menu.select.append(new gui.MenuItem({
    label: 'Deselect',
    click: function() {
      var layer = flux.stores.UiStore.getData().layers.selected;
      flux.actions.selectionClear();
      flux.actions.scopeSet(layer, 'layer', layer);
    },
    key: 'd',
    modifiers: modKey,
    enabled: false,
  }));


  //------------------------------------------------------------------------------
  // create "Layer" menu
  menu.layer = new gui.Menu();
  menuBar.append(new gui.MenuItem({label: 'Layer', submenu: menu.layer}));

  menu.layer.append(new gui.MenuItem({
    label: 'Merge with layer above',
    click: function() {
      var data = {
        top: storeUtils.layers.getAboveSelected(),
        bottom: storeUtils.layers.getSelected(),
      };
      if(data.top) channel.gui.publish('layer.merge', data);
    },
    key: 'e',
    modifiers: 'shift-'+modKey,
    enabled: false,
  }));

  menu.layer.append(new gui.MenuItem({
    label: 'Merge with layer below',
    click: function() {
      var data = {
        top: storeUtils.layers.getSelected(),
        bottom: storeUtils.layers.getBelowSelected(),
      };
      if(data.bottom) channel.gui.publish('layer.merge', data);
    },
    key: 'e',
    modifiers: modKey,
    enabled: false,
  }));


  //------------------------------------------------------------------------------
  // create "Frame" menu
  menu.frame = new gui.Menu();
  menuBar.append(new gui.MenuItem({label: 'Frame', submenu: menu.frame}));

  menu.frame.append(new gui.MenuItem({
    label: 'Rotate 180°',
    click: function() {
      // channel.gui.publish('frame.flip.horizontal');
      alert('not yet, sorry');
    },
    enabled: false,
  }));

  menu.frame.append(new gui.MenuItem({
    label: 'Rotate 90° CW',
    click: function() {
      // channel.gui.publish('frame.flip.horizontal');
      alert('not yet, sorry');
    },
    enabled: false,
  }));

  menu.frame.append(new gui.MenuItem({
    label: 'Rotate 90° CCW',
    click: function() {
      // channel.gui.publish('frame.flip.horizontal');
      alert('not yet, sorry');
    },
    enabled: false,
  }));

  menu.frame.append(new gui.MenuItem({ type: 'separator' }));

  menu.frame.append(new gui.MenuItem({
    label: 'Flip Horizontal',
    click: function() {
      channel.gui.publish('frame.flip.horizontal');
    },
    enabled: false,
  }));

  menu.frame.append(new gui.MenuItem({
    label: 'Flip Vertical',
    click: function() {
      channel.gui.publish('frame.flip.vertical');
    },
    enabled: false,
  }));

  //------------------------------------------------------------------------------
  // create "Developer" menu
  menu.developer = new gui.Menu();
  menuBar.append(new gui.MenuItem({label: 'Developer', submenu: menu.developer}));

  menu.developer.append(new gui.MenuItem({
    label: 'Open Developer Tools',
    click: function() {
      require('nw.gui').Window.get().showDevTools();
    }
  }));

  menu.developer.append(new gui.MenuItem({
    label: 'Reload Application',
    click: function() {
      require('nw.gui').Window.get().reloadDev();
    }
  }));

  menu.developer.append(new gui.MenuItem({
    label: 'Show Debug Screen',
    click: function() {
      flux.actions.tabSelect('debug');
    }
  }));


  //------------------------------------------------------------------------------
  // enable menus after file was loaded
  channel.file.subscribe('file.load', function() {
    function enable(item) { item.enabled = true; }
    menu.file.items.map(enable);
    menu.edit.items.map(enable);
    menu.select.items.map(enable);
    menu.layer.items.map(enable);
    menu.frame.items.map(enable);
  });

  // assign menu to window
  gui.Window.get().menu = menuBar;
} // menu_init()

