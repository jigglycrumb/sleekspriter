var UiStore = Fluxxor.createStore({
  initialize: function() {
    console.log('UiStore.initialize');

    this.resetData();

    this.bindActions(
      constants.MODAL_SHOW, this.onShowModal,
      constants.MODAL_HIDE, this.onHideModal,
      constants.TAB_SELECT, this.onTabSelect
    );
  },

  getData: function() {
    return this.data;
  },

  resetData: function(key) {
    var data = {
      tab: 'start',
      modal: {
        visible: false,
        component: null,
        data: null,
      },
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  onTabSelect: function(payload) {
    this.data.tab = payload.tab;
    this.emit('change');
  },

  onShowModal: function(payload) {
    this.data.modal = payload;
    this.emit('change');
  },

  onHideModal: function() {
    this.resetData('modal');
    this.emit('change');
  },

});