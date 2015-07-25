var LayerStore = Fluxxor.createStore({
  initialize: function() {
    console.log('LayerStore.initialize');

    this.resetData();

    this.bindActions(
      // constants.FILE_LOAD, this.onFileLoad,
      // constants.FRAME_SELECT, this.onFrameSelect
    );
  },

  getData: function(key) {
    if(key && this.data[key]) return this.data[key];
    else return this.data;
  },

  resetData: function(key) {
    var data = {
      selected: null,
      frame: [],
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

});