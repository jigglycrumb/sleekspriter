// var platformUtils = require('./PlatformUtils');

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
      action: null
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

MenuConfig.prototype.constructor = MenuConfig;

// module.exports = new MenuConfig();
