var Menu = {
  obj: null,

  init: function() {
    // setup, save result in Menu.obj
  },

  actions: {
    file: {
      newFile: function() {
        flux.actions.modalShow(ModalNewFile);
      },
      openFile: function() {
        console.log('openFile');
        platformUtils.showOpenFileDialog();
      },
      saveFile: function() {
        console.log('saveFile');
        platformUtils.showSaveFileDialog();
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
