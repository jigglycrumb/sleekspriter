var Menu = function() {

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
    {label: 'New', action: function() {
      flux.actions.modalShow(ModalNewFile);
      flux.actions.menuHide();
    }},
    {label: 'Open', action: function() {
      platformUtils.showOpenFileDialog();
      flux.actions.menuHide();
    }},
    {label: 'Save', action: function() {
      flux.actions.fileSave();
      flux.actions.menuHide();

      if(platformUtils.device == 'browser') {
        platformUtils.showSaveFileDialog();
      }
    }}
  ];

  if(platformUtils.device !== 'browser') {
    items.push({label: 'Save as', action: null});
  }

  items.push(separator);
  items.push({label: 'Close', action: function() {
    flux.actions.fileSave();
    flux.actions.menuHide();

    if(platformUtils.device == 'browser') {
      platformUtils.showSaveFileDialog();
    }

    flux.actions.tabSelect('start');
  }});

  menu[0].items = items;


  // Edit menu
  items = [
    {label: 'Cut', action: function() {
      flux.actions.scopeCut();
      flux.actions.menuHide();
    }},
    {label: 'Copy', action: function() {
      flux.actions.scopeCopy();
      flux.actions.menuHide();
    }},
    {label: 'Paste', action: function() {
      flux.actions.scopePaste();
      flux.actions.menuHide();
    }},
    {label: 'Delete', action: function() {
      flux.actions.scopeDelete();
      flux.actions.menuHide();
    }},
    separator,
    {label: 'Rotate 180°', action: function() {
      flux.actions.scopeRotate(180);
      flux.actions.menuHide();
    }},
    {label: 'Rotate 90° CW', action: function() {
      flux.actions.scopeRotate(90);
      flux.actions.menuHide();
    }},
    {label: 'Rotate 90° CCW', action: function() {
      flux.actions.scopeRotate(270);
      flux.actions.menuHide();
    }},
    separator,
    {label: 'Flip Horizontal', action: function() {
      flux.actions.scopeFlipHorizontal();
      flux.actions.menuHide();
    }},
    {label: 'Flip Vertical', action: function() {
      flux.actions.scopeFlipVertical();
      flux.actions.menuHide();
    }},
    separator,
    {label: 'Image size …', action: function() {
      flux.actions.modalShow(ModalEditImageSize);
      flux.actions.menuHide();
    }},
  ];

  menu[1].items = items;

  // Select menu
  items = [
    {label: 'All', action: function() {
      var start = new Point(1, 1),
          end = new Point(flux.stores.FileStore.getData().size.width, flux.stores.FileStore.getData().size.height),
          layer = flux.stores.UiStore.getData().layers.selected;

      flux.actions.selectionClear();
      flux.actions.selectionStart(start);
      flux.actions.selectionEnd(end);
      flux.actions.menuHide();
    }},
    {label: 'Deselect', action: function() {
      flux.actions.selectionClear();
      flux.actions.menuHide();
    }},
  ];

  menu[2].items = items;

  // Layer menu
  items = [
    {label: 'Merge with layer above', action: function() {
      var top = storeUtils.layers.getAboveSelected();
      if(top) {
        var bottom = storeUtils.layers.getSelected();
        flux.actions.layerMerge(top, bottom);
        flux.actions.layerSelect(bottom.id);
        flux.actions.layerDelete(top.id);
      }
      flux.actions.menuHide();
    }},
    {label: 'Merge with layer below', action: function() {
      var bottom = storeUtils.layers.getBelowSelected();
      if(bottom) {
        var top = storeUtils.layers.getSelected();
        flux.actions.layerMerge(top, bottom);
        flux.actions.layerSelect(bottom.id);
        flux.actions.layerDelete(top.id);
      }
      flux.actions.menuHide();
    }},
  ];

  menu[3].items = items;

  // Frame menu
  items = [
    {label: 'Rotate 180°', action: function() {
      flux.actions.frameRotate(180);
      flux.actions.menuHide();
    }},
    {label: 'Rotate 90° CW', action: function() {
      flux.actions.frameRotate(90);
      flux.actions.menuHide();
    }},
    {label: 'Rotate 90° CCW', action: function() {
      flux.actions.frameRotate(270);
      flux.actions.menuHide();
    }},
    separator,
    {label: 'Flip Horizontal', action: function() {
      flux.actions.frameFlipHorizontal();
      flux.actions.menuHide();
    }},
    {label: 'Flip Vertical', action: function() {
      flux.actions.frameFlipVertical();
      flux.actions.menuHide();
    }},
    separator,
    {label: 'Duplicate …', action: function() {
      flux.actions.modalShow(ModalDuplicateFrame);
      flux.actions.menuHide();
    }},
  ];

  menu[4].items = items;

  if(platformUtils.device !== 'browser') {
    menu.push({label: "Developer", items: []});

    // Developer menu
    items = [
      {label: 'Open Developer Tools', action: function() {
        if(platformUtils.device == 'desktop') {
          // require('nw.gui').Window.get().showDevTools();
        }
      }},
      {label: 'Reload App', action: function() {
        if(platformUtils.device == 'desktop') {
          // require('nw.gui').Window.get().reloadDev();
        }
      }},
      {label: 'Show Debug Screen', action: function() {
        if(platformUtils.device == 'desktop') {
          flux.actions.tabSelect('debug');
          flux.actions.menuHide();
        }
      }},
    ];

    menu[5].items = items;
  }

  return menu;
};

Menu.prototype.constructor = Menu;

module.exports = new Menu();
