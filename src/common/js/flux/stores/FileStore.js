var FileStore = Fluxxor.createStore({
  initialize: function() {
    console.log('FileStore.initialize');

    this.resetData();

    this.bindActions(
      constants.FILE_LOAD, this.onLoad,
      constants.FILE_SAVE, this.onSave
    );
  },

  getData: function() {
    return this.data;
  },

  resetData: function(key) {
    var data = {
      path: null,
      name: null,
      folder: null,

      size: null,
      frames: null,
      layers: null,
      animations: null,
      pixels: null,
    };

    if(key && data[key]) this.data[key] = data[key];
    else this.data = data;
  },

  onLoad: function(payload) {
    console.log('FileStore.onLoad');
    this.emit('change');
  },

  onSave: function(payload) {
    console.log('FileStore.onSave');
    this.emit('change');
  },

});