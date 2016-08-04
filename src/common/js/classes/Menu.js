var Menu = {
  obj: null,

  init: function() {
    // setup, save result in Menu.obj
  },

  actions: {
    file: {
      newFile: function() {
        flux.actions.modalShow(ModalNewFile);
        flux.actions.menuHide();
      },
      openFile: function() {
        platformUtils.showOpenFileDialog();
      },
      saveFile: function() {
        flux.actions.fileSave();
        flux.actions.menuHide();

        if(platformUtils.device == 'browser') {
          platformUtils.showSaveFileDialog();
        }
      },
    },
    edit: {},
    select: {},
    layer: {},
    frame: {},
    developer: {},
  },

};

module.exports = Menu;
