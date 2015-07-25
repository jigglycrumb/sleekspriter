var UiStore = Fluxxor.createStore({
  initialize: function() {
    console.log('UiStore.initialize');

    this.resetData();

    this.bindActions(
      constants.FILE_LOAD, this.onFileLoad,
      constants.TAB_SELECT, this.onTabSelect,
      constants.TOOL_SELECT, this.onToolSelect,
      constants.FRAME_SELECT, this.onFrameSelect,
      constants.MODAL_SHOW, this.onModalShow,
      constants.MODAL_HIDE, this.onModalHide
    );
  },

  getData: function(key) {
    if(key && this.data[key]) return this.data[key];
    else return this.data;
  },

  resetData: function(key) {
    var data = {
      tab: 'start',
      tool: 'BrushTool',
      modal: {
        visible: false,
        component: null,
        data: null,
      },
      frames: {
        selected: 1,
        total: 1,
      },
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  onFileLoad: function(payload) {
    this.waitFor(['FileStore'], function(FileStore) {
      console.log('UiStore.onFileLoad');
      this.data.frames.selected = 1;
      this.data.frames.total = FileStore.getData('frames').x * FileStore.getData('frames').y;
      this.emit('change');
    });
  },

  onTabSelect: function(payload) {
    console.log('UiStore.onTabSelect');
    this.data.tab = payload.tab;
    this.emit('change');
  },

  onToolSelect: function(payload) {
    console.log('UiStore.onToolSelect');
    this.data.tool = payload.tool;
    this.emit('change');
  },

  onFrameSelect: function(payload) {
    console.log('UiStore.onFrameSelect');
    this.data.frames.selected = payload.frame;
    this.emit('change');
  },

  onModalShow: function(payload) {
    this.data.modal = payload;
    this.emit('change');
  },

  onModalHide: function() {
    this.resetData('modal');
    this.emit('change');
  },

});