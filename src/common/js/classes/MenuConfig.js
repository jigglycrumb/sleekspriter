// var platformUtils = require('./PlatformUtils');

// define keyboard mod key
if(platformUtils.device === 'desktop') {
  var modKey = process.platform === 'darwin' ? 'cmd' : 'ctrl';
  var gui = require('nw.gui');
  var menuBar = new gui.Menu({ type: "menubar" });

  var showCredits = function() {
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
  };

  var closeCredits = function() {
    creditsWindow.close();
  };

  var enableMenus = function(enabled) {
    function enable(item) { item.enabled = enabled; }

    menuBar.items.forEach(function(menu) {
      menu.submenu.items.map(enable);
    });
  };
}


var creditsWindow;

var MOD_META = 1,
    MOD_SHIFT_META = 2;

var MenuConfig = function() {

  var menu = [
    {label: "File", items: []},
    {label: "Edit", items: []},
    {label: "Select", items: []},
    {label: "Layer", items: []},
    {label: "Frame", items: []},
  ];

  var separator = {label: '---', action: null};

  // File menu
  var items = [
    {
      label: 'New',
      key: 'n',
      modifiers: MOD_META,
      action: function() {
        if(flux.stores.UiStore.getData().tab === 'start') {
          flux.actions.tabSelect('paint');
        }
        flux.actions.modalShow(ModalNewFile);
        flux.actions.menuHide();
      }
    },
    {
      label: 'Open',
      key: 'o',
      modifiers: MOD_META,
      action: function() {
        platformUtils.showOpenFileDialog();
        flux.actions.menuHide();
      }
    },
    {
      label: 'Save',
      key: 's',
      modifiers: MOD_META,
      enabled: false,
      action: function() {
        flux.actions.fileSave();
        flux.actions.menuHide();

        if(platformUtils.device == 'browser') {
          platformUtils.showSaveFileDialog();
        }
      }
    }
  ];

  if(platformUtils.device !== 'browser') {
    items.push({
      label: 'Save as',
      key: 's',
      modifiers: MOD_SHIFT_META,
      enabled: false,
      action: function() {
        flux.actions.menuHide();
        platformUtils.showSaveFileDialog();
      }
    });
  }

  items.push({
    label: 'Import …',
    key: 'i',
    modifiers: MOD_SHIFT_META,
    action: function() {
      flux.actions.modalShow(ModalImportFile);
      flux.actions.menuHide();
    }
  });

  items.push(separator);

  items.push({
    label: 'Close',
    key: 'w',
    modifiers: MOD_META,
    enabled: false,
    action: function() {
      // todo: ask for save/don't save/cancel, then properly close the file
      flux.actions.fileSave();
      flux.actions.menuHide();

      if(platformUtils.device == 'browser') {
        platformUtils.showSaveFileDialog();
      }

      flux.actions.tabSelect('start');
    }
  });

  if(platformUtils.device === 'desktop') {
    // append "About" and "Quit" menu items to windows menu
    if(process.platform === 'win32' || process.platform === 'win64') {

      items.push(separator);

      items.push({
        label: 'About @@name',
        enabled: false,
        action: function() {
          showCredits();
        }
      });

      items.push(separator);

      items.push({
        label: 'Quit @@name',
        key: 'q',
        modifiers: MOD_META,
        action: function() {
          gui.App.quit();
        }
      });
    }
  }

  menu[0].items = items;


  // Edit menu
  items = [
    {
      label: 'Cut',
      key: 'x',
      modifiers: MOD_META,
      enabled: false,
      action: function() {
        flux.actions.scopeCut();
        flux.actions.menuHide();
      }
    },
    {
      label: 'Copy',
      key: 'c',
      modifiers: MOD_META,
      enabled: false,
      action: function() {
        flux.actions.scopeCopy();
        flux.actions.menuHide();
      }
    },
    {
      label: 'Paste',
      key: 'p',
      modifiers: MOD_META,
      enabled: false,
      action: function() {
        flux.actions.scopePaste();
        flux.actions.menuHide();
      }
    },
    {
      label: 'Delete',
      enabled: false,
      key: String.fromCharCode(8),
      action: function() {
        flux.actions.scopeDelete();
        flux.actions.menuHide();
      }
    },
    separator,
    {
      label: 'Rotate 180°',
      enabled: false,
      action: function() {
        flux.actions.scopeRotate(180);
        flux.actions.menuHide();
      }
    },
    {
      label: 'Rotate 90° CW',
      enabled: false,
      action: function() {
        flux.actions.scopeRotate(90);
        flux.actions.menuHide();
      }
    },
    {
      label: 'Rotate 90° CCW',
      enabled: false,
      action: function() {
        flux.actions.scopeRotate(270);
        flux.actions.menuHide();
      }
    },
    separator,
    {
      label: 'Flip Horizontal',
      enabled: false,
      action: function() {
        flux.actions.scopeFlipHorizontal();
        flux.actions.menuHide();
      }
    },
    {
      label: 'Flip Vertical',
      enabled: false,
      action: function() {
        flux.actions.scopeFlipVertical();
        flux.actions.menuHide();
      }
    },
    separator,
    {
      label: 'Image size …',
      key: 'i',
      modifiers: MOD_META,
      enabled: false,
      action: function() {
        flux.actions.modalShow(ModalEditImageSize);
        flux.actions.menuHide();
      }
    },
  ];

  menu[1].items = items;

  // Select menu
  items = [
    {
      label: 'All',
      key: 'a',
      modifiers: MOD_META,
      enabled: false,
      action: function() {
        var start = new Point(1, 1),
            end = new Point(flux.stores.FileStore.getData().size.width, flux.stores.FileStore.getData().size.height),
            layer = flux.stores.UiStore.getData().layers.selected;

        flux.actions.selectionClear();
        flux.actions.selectionStart(start);
        flux.actions.selectionEnd(end);
        flux.actions.menuHide();
      }
    },
    {
      label: 'Deselect',
      key: 'd',
      modifiers: MOD_META,
      enabled: false,
      action: function() {
        flux.actions.selectionClear();
        flux.actions.menuHide();
      }
    },
  ];

  menu[2].items = items;

  // Layer menu
  items = [
    {
      label: 'Merge with layer above',
      key: 'e',
      modifiers: MOD_SHIFT_META,
      enabled: false,
      action: function() {
        var top = storeUtils.layers.getAboveSelected();
        if(top) {
          var bottom = storeUtils.layers.getSelected();
          flux.actions.layerMerge(top, bottom);
          flux.actions.layerSelect(bottom.id);
          flux.actions.layerDelete(top.id);
        }
        flux.actions.menuHide();
      }
    },
    {
      label: 'Merge with layer below',
      key: 'e',
      modifiers: MOD_META,
      enabled: false,
      action: function() {
        var bottom = storeUtils.layers.getBelowSelected();
        if(bottom) {
          var top = storeUtils.layers.getSelected();
          flux.actions.layerMerge(top, bottom);
          flux.actions.layerSelect(bottom.id);
          flux.actions.layerDelete(top.id);
        }
        flux.actions.menuHide();
      }
    },
  ];

  menu[3].items = items;

  // Frame menu
  items = [
    {
      label: 'Rotate 180°',
      enabled: false,
      action: function() {
        flux.actions.frameRotate(180);
        flux.actions.menuHide();
      }
    },
    {
      label: 'Rotate 90° CW',
      enabled: false,
      action: function() {
        flux.actions.frameRotate(90);
        flux.actions.menuHide();
      }
    },
    {
      label: 'Rotate 90° CCW',
      enabled: false,
      action: function() {
        flux.actions.frameRotate(270);
        flux.actions.menuHide();
      }
    },
    separator,
    {
      label: 'Flip Horizontal',
      enabled: false,
      action: function() {
        flux.actions.frameFlipHorizontal();
        flux.actions.menuHide();
      }
    },
    {
      label: 'Flip Vertical',
      enabled: false,
      action: function() {
        flux.actions.frameFlipVertical();
        flux.actions.menuHide();
      }
    },
    separator,
    {
      label: 'Duplicate …',
      enabled: false,
      key: 'd',
      modifiers: MOD_SHIFT_META,
      action: function() {
        flux.actions.modalShow(ModalDuplicateFrame);
        flux.actions.menuHide();
      }
    },
  ];

  menu[4].items = items;

  if(platformUtils.device !== 'browser') {
    menu.push({label: "Developer", items: []});

    // Developer menu
    items = [
      {
        label: 'Open Developer Tools',
        action: function() {
          if(platformUtils.device == 'desktop') {
            require('nw.gui').Window.get().showDevTools();
          }
        }
      },
      {
        label: 'Reload App',
        action: function() {
          if(platformUtils.device == 'desktop') {
            require('nw.gui').Window.get().reloadDev();
          }
        }
      },
      {
        label: 'Show Debug Screen',
        action: function() {
          if(platformUtils.device == 'desktop') {
            flux.actions.tabSelect('debug');
            flux.actions.menuHide();
          }
        }
      },
    ];

    menu[5].items = items;
  }

  return menu;
};

MenuConfig.prototype = Object.create(null);
MenuConfig.prototype.constructor = MenuConfig;

function initializeDesktopMenu() {
  if(platformUtils.device === 'desktop') {
    if(process.platform === 'darwin') {
      // create default mac menu
      menuBar.createMacBuiltin("@@name", {
        hideEdit: true,
        hideWindow: true
      });
    }

    menuConfig.forEach(function(cfg) {
      var subMenu = new gui.Menu();
      menuBar.append(new gui.MenuItem({label: cfg.label, submenu: subMenu}));

      cfg.items.forEach(function(itemCfg) {
        if(itemCfg.label == '---') {
          subMenu.append(new gui.MenuItem({ type: 'separator' }));
        }
        else {
          var item = itemCfg;
          item.click = function() {
            item.action();
          };

          try {
            switch(item.modifiers) {
              case MOD_META:
                item.modifiers = modKey;
                break;
              case MOD_SHIFT_META:
                item.modifiers = 'shift-'+modKey;
                break;
            }
          } catch(e) {}

          subMenu.append(new gui.MenuItem(item));
        }
      });
    });

    // assign menu to window
    gui.Window.get().menu = menuBar;
  }
}

// module.exports = new MenuConfig();
