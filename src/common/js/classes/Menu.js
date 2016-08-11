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
        flux.actions.menuHide();
      },
      saveFile: function() {
        flux.actions.fileSave();
        flux.actions.menuHide();

        if(platformUtils.device == 'browser') {
          platformUtils.showSaveFileDialog();
        }
      },
      closeFile: function() {
        flux.actions.fileSave();
        flux.actions.menuHide();

        if(platformUtils.device == 'browser') {
          platformUtils.showSaveFileDialog();
        }

        flux.actions.tabSelect('start');
      },
    },
    edit: {},
    select: {},
    layer: {},
    frame: {
      flipHorizontal: function() {
        flux.actions.frameFlipHorizontal();
      },
      flipVertical: function() {
        flux.actions.frameFlipVertical();
      },
      rotate180: function() {
        flux.actions.frameRotate(180);
      },
      rotate90CW: function() {
        flux.actions.frameRotate(90);
      },
      rotate90CCW: function() {
        flux.actions.frameRotate(270);
      },
      duplicate: function() {
        flux.actions.modalShow(ModalDuplicateFrame);
      },
    },
    developer: {},
  },

};

module.exports = Menu;
