var actions = {
  fileLoad: function(path) {
    console.log('actions.fileLoad');

    this.dispatch(constants.FILE_LOAD, {path: path});
  },
  fileSave: function() {
    console.log('actions.fileSave');

    this.dispatch(constants.FILE_SAVE, {});
  },
};