var Menu = function() {

  var menu = [
    {label: "File", items: []},
    {label: "Edit", items: []},
    {label: "Select", items: []},
    {label: "Layer", items: []},
    {label: "Frame", items: []},
  ];

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

  items.push({label: '---', action: null});
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
    {label: 'Cut', action: null},
    {label: 'Copy', action: null},
    {label: 'Paste', action: null},
    {label: 'Delete', action: null},
    {label: '---', action: null},
    {label: 'Rotate 180°', action: null},
    {label: 'Rotate 90° CW', action: null},
    {label: 'Rotate 90° CCW', action: null},
    {label: '---', action: null},
    {label: 'Flip Horizontal', action: null},
    {label: 'Flip Vertical', action: null},
    {label: '---', action: null},
    {label: 'Image size …', action: null},
  ];

  menu[1].items = items;

  // Select menu
  items = [
    {label: 'All', action: null},
    {label: 'Deselect', action: null},
  ];

  menu[2].items = items;

  // Layer menu
  items = [
    {label: 'Merge with layer above', action: null},
    {label: 'Merge with layer below', action: null},
  ];

  menu[3].items = items;

  // Frame menu
  items = [
    {label: 'Rotate 180°', action: function() {
      flux.actions.frameRotate(180);
    }},
    {label: 'Rotate 90° CW', action: function() {
      flux.actions.frameRotate(90);
    }},
    {label: 'Rotate 90° CCW', action: function() {
      flux.actions.frameRotate(270);
    }},
    {label: '---', action: null},
    {label: 'Flip Horizontal', action: function() {
      flux.actions.frameFlipHorizontal();
    }},
    {label: 'Flip Vertical', action: function() {
      flux.actions.frameFlipVertical();
    }},
    {label: '---', action: null},
    {label: 'Duplicate …', action: function() {
      flux.actions.modalShow(ModalDuplicateFrame);
    }},
  ];

  menu[4].items = items;

  if(platformUtils.device !== 'browser') {
    menu.push({label: "Developer", items: []});

    // Developer menu
    items = [
      {label: 'Open Developer Tools', action: null},
      {label: 'Reload App', action: null},
      {label: 'Show Debug Screen', action: null},
    ];

    menu[5].items = items;
  }

  return menu;
};

Menu.prototype.constructor = Menu;

module.exports = new Menu();
