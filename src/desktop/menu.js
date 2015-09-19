// define keyboard mod key
var modKey = process.platform === 'darwin' ? 'cmd' : 'ctrl';

var gui = require('nw.gui');
var menu = {};
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

  //----------------------------------------------------------------------------
  // "File" menu
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
    click: platformUtils.showOpenFileDialog,
    key: 'o',
    modifiers: modKey,
  }));

  menu.file.append(new gui.MenuItem({
    label: 'Save',
    click: flux.actions.fileSave,
    key: 's',
    modifiers: modKey,
    enabled: false,
  }));

  menu.file.append(new gui.MenuItem({
    label: 'Save as',
    click: platformUtils.showSaveFileDialog,
    key: 's',
    modifiers: 'shift-'+modKey,
    enabled: false,
  }));

  menu.file.append(new gui.MenuItem({ type: 'separator' }));

  menu.file.append(new gui.MenuItem({
    label: 'Close',
    click: function() {
      // todo: ask for save/don't save/cancel, then properly close the file
      flux.actions.fileSave();
      flux.actions.screenSelect('start');
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

  //----------------------------------------------------------------------------
  // "Edit" menu
  menu.edit = new gui.Menu();
  menuBar.append(new gui.MenuItem({label: 'Edit', submenu: menu.edit}));

  menu.edit.append(new gui.MenuItem({
    label: 'Cut',
    click: flux.actions.scopeCut,
    key: 'x',
    modifiers: modKey,
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({
    label: 'Copy',
    click: flux.actions.scopeCopy,
    key: 'c',
    modifiers: modKey,
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({
    label: 'Paste',
    click: flux.actions.scopePaste,
    key: 'v',
    modifiers: modKey,
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({
    label: 'Delete',
    click: flux.actions.scopeDelete,
    key: String.fromCharCode(8),
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({ type: 'separator' }));

  menu.edit.append(new gui.MenuItem({
    label: 'Flip Horizontal',
    click: flux.actions.scopeFlipHorizontal,
    enabled: false,
  }));

  menu.edit.append(new gui.MenuItem({
    label: 'Flip Vertical',
    click: flux.actions.scopeFlipVertical,
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

  //----------------------------------------------------------------------------
  // "Select" menu
  menu.select = new gui.Menu();
  menuBar.append(new gui.MenuItem({label: 'Select', submenu: menu.select}));

  menu.select.append(new gui.MenuItem({
    label: 'All',
    click: function() {
      var start = new Point(1, 1),
          end = new Point(flux.stores.FileStore.getData().size.width, flux.stores.FileStore.getData().size.height),
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


  //----------------------------------------------------------------------------
  // "Layer" menu
  menu.layer = new gui.Menu();
  menuBar.append(new gui.MenuItem({label: 'Layer', submenu: menu.layer}));

  menu.layer.append(new gui.MenuItem({
    label: 'Merge with layer above',
    click: function() {
      var top = storeUtils.layers.getAboveSelected();
      if(top) {
        var bottom = storeUtils.layers.getSelected();
        flux.actions.layerMerge(top, bottom);
        flux.actions.layerSelect(bottom.id);
        flux.actions.layerDelete(top.id);
      }
    },
    key: 'e',
    modifiers: 'shift-'+modKey,
    enabled: false,
  }));

  menu.layer.append(new gui.MenuItem({
    label: 'Merge with layer below',
    click: function() {
      var bottom = storeUtils.layers.getBelowSelected();
      if(bottom) {
        var top = storeUtils.layers.getSelected();
        flux.actions.layerMerge(top, bottom);
        flux.actions.layerSelect(bottom.id);
        flux.actions.layerDelete(top.id);
      }
    },
    key: 'e',
    modifiers: modKey,
    enabled: false,
  }));


  //----------------------------------------------------------------------------
  // "Frame" menu
  menu.frame = new gui.Menu();
  menuBar.append(new gui.MenuItem({label: 'Frame', submenu: menu.frame}));

  menu.frame.append(new gui.MenuItem({
    label: 'Rotate 180°',
    click: function() {
      alert('not yet, sorry');
    },
    enabled: false,
  }));

  menu.frame.append(new gui.MenuItem({
    label: 'Rotate 90° CW',
    click: function() {
      alert('not yet, sorry');
    },
    enabled: false,
  }));

  menu.frame.append(new gui.MenuItem({
    label: 'Rotate 90° CCW',
    click: function() {
      alert('not yet, sorry');
    },
    enabled: false,
  }));

  menu.frame.append(new gui.MenuItem({ type: 'separator' }));

  menu.frame.append(new gui.MenuItem({
    label: 'Flip Horizontal',
    click: flux.actions.frameFlipHorizontal,
    enabled: false,
  }));

  menu.frame.append(new gui.MenuItem({
    label: 'Flip Vertical',
    click: flux.actions.frameFlipVertical,
    enabled: false,
  }));

  menu.frame.append(new gui.MenuItem({ type: 'separator' }));

  menu.frame.append(new gui.MenuItem({
    label: 'Duplicate...',
    click: function() {
      flux.actions.modalShow(ModalDuplicateFrame);
    },
    key: 'd',
    modifiers: 'shift+'+modKey,
    enabled: false,
  }));

  //----------------------------------------------------------------------------
  // "Developer" menu
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

  //----------------------------------------------------------------------------
  // assign menu to window
  gui.Window.get().menu = menuBar;
} // menu_init()
