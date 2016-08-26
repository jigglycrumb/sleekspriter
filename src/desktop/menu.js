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

function enableMenus(enabled) {
  // function enable(item) { item.enabled = enabled; }
  // for(var x in menu) if(x !== 'developer') menu[x].items.map(enable);
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


  /*
  //----------------------------------------------------------------------------
  // "File" menu

  menu.file.append(new gui.MenuItem({
    label: 'Save as',
    click: platformUtils.showSaveFileDialog,
    key: 's',
    modifiers: 'shift-'+modKey,
    enabled: false,
  }));

  // append "About" and "Quit" menu items to windows menu
  if(process.platform === 'win32' || process.platform === 'win64') {

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

  */

  //----------------------------------------------------------------------------
  // assign menu to window
  gui.Window.get().menu = menuBar;
} // menu_init()
