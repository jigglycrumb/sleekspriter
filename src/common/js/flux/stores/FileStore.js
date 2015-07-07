var FileStore = Fluxxor.createStore({
  initialize: function() {
    console.log('FileStore.initialize');

    this._initProps();

    this.bindActions(
      constants.FILE_LOAD, this.onLoad,
      constants.FILE_SAVE, this.onSave
    );
  },

  onLoad: function(payload) {


    console.log('FileStore.onLoad');
  },

  onSave: function(payload) {


    console.log('FileStore.onSave');
  },

  _initProps: function() {
    this.path = null;
    this.name = null;
    this.folder = null;

    this.size = null;
    this.frames = null;
    this.layers = null;
    this.animations = null;
    this.pixels = null;
  },


});