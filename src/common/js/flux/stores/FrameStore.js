var FrameStore = Fluxxor.createStore({
  initialize: function() {
    console.log('FrameStore.initialize');

    this.resetData();

    this.bindActions(
      constants.FILE_LOAD, this.onFileLoad,
      constants.FRAME_SELECT, this.onFrameSelect
    );
  },

  getData: function(key) {
    if(key && this.data[key]) return this.data[key];
    else return this.data;
  },

  resetData: function(key) {
    var data = {
      selected: 1,
      x: 1,
      y: 1,
      total: 1,
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  onFileLoad: function(payload) {
    this.waitFor(['FileStore'], function(fileStore) {
      console.log('FrameStore.onFileLoad');
      this.data.selected = 1;
      this.data.x = fileStore.getData('frames').x;
      this.data.y = fileStore.getData('frames').y;
      this.data.total = this.data.x * this.data.y;
      this.emit('change');
    });
  },

  onFrameSelect: function(payload) {
    this.data.selected = payload.frame;
    this.emit('change');
  },

  /*
  updateSize: function(data) {
    self.x = data.frames.x;
    self.y = data.frames.y;
  },
  */

});