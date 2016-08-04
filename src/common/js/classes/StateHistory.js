var StateHistory = function() {
  this.last = {
    action: null,
    payload: null,
    pixels: [], // saves pixels for undo
  };

  this.undoPointer = -1;
  this.undoLimit = 30; // max number of steps saved

  this.undoOn = [ // List of messages which add an undo state
    'FILE_CREATE',
    'FILE_LOAD',
    'SCOPE_CUT',
    'SCOPE_DELETE',
    'SCOPE_PASTE',
    'SCOPE_FLIP_HORIZONTAL',
    'SCOPE_FLIP_VERTICAL',
    'SCOPE_ROTATE',
    'SELECTION_MOVE',
    'PIXEL_ADD',
    'PIXEL_DELETE',
    'PIXELS_ADD',
    'PIXELS_MOVE',
    'PAINTBUCKET',
  ];
};

StateHistory.prototype.constructor = StateHistory;

StateHistory.prototype.addUndoState = function() {
  if(inArray(this.undoOn, this.last.action)) {
    var dictionary = _.cloneDeep(flux.stores.PixelStore.getData().dict, function(dict) {

      // TODO
      // this is lots of duplicate code from FileStore and PixelStore
      // and similar code is also needed in the Canvases
      // move to some helper methods for more DRYness

      // taken from FileStore._dictToArray
      var flen, llen, xlen, ylen,
          frames, f, frame,
          layers, l, layer,
          xValues, x, xValue,
          yValues, y, yValue,
          pixel, pixels;

      pixels = {};

      frames = Object.keys(dict);
      flen = frames.length;

      for(f = 0; f < flen; f++) {
        frame = frames[f];

        layers = Object.keys(dict[frame]);
        llen = layers.length;

        for(l = 0; l < llen; l++) {
          layer = layers[l];

          xValues = Object.keys(dict[frame][layer]);
          xlen = xValues.length;

          for(x = 0; x < xlen; x++) {
            xValue = xValues[x];

            yValues = Object.keys(dict[frame][layer][xValue]);
            ylen = yValues.length;

            for(y = 0; y < ylen; y++) {
              yValue = yValues[y];
              pixel = dict[frame][layer][xValue][yValue].clone();

              // taken from PixelStore.writeToDictionary
              if(undefined === pixels[frame]) pixels[frame] = {};
              if(undefined === pixels[frame][layer]) pixels[frame][layer] = {};
              if(undefined === pixels[frame][layer][xValue]) pixels[frame][layer][xValue] = {};
              if(undefined === pixels[frame][layer][xValue][yValue]) pixels[frame][layer][xValue][yValue] = {};

              pixels[frame][layer][xValue][yValue] = pixel;
            }
          }
        }
      }

      return pixels;
    });

    this.last.pixels.push(dictionary);
    this.undoPointer += 1;

    if(this.last.pixels.length > this.undoLimit) {
      this.last.pixels.shift();
    }
  }
};

StateHistory.prototype.undo = function() {
  if(this.undoPointer >= 0) {
    this.undoPointer -= 1;
    flux.actions.historyUndo();

    // if(this.undoPointer < 0) this.undoPointer = 0;
  }
};

StateHistory.prototype.redo = function() {
  if(this.undoPointer < this.last.pixels.length) {
    this.undoPointer += 1;
    flux.actions.historyRedo();
  }
};

module.exports = new StateHistory();
