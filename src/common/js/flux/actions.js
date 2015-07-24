var actions = {
  fileCreate: function(framesX, framesY, pixelsX, pixelsY) {
    console.log('actions.fileCreate');
    this.dispatch(constants.FILE_CREATE, {framesX: framesX, framesY: framesY, pixelsX: pixelsX, pixelsY: pixelsY});
  },

  fileLoad: function(data) {
    console.log('actions.fileLoad');
    this.dispatch(constants.FILE_LOAD, data);
  },

  fileSave: function() {
    console.log('actions.fileSave');
    this.dispatch(constants.FILE_SAVE, {});
  },

  selectTab: function(tab) {
    console.log('actions.selectTab');
    this.dispatch(constants.TAB_SELECT, {tab: tab});
  },

  modalShow: function(component, data) {
    console.log('actions.modalShow');
    data = data || {};
    this.dispatch(constants.MODAL_SHOW, {component: component, data: data, visible: true});
  },

  modalHide: function() {
    console.log('actions.modalHide');
    this.dispatch(constants.MODAL_HIDE);
  },

};