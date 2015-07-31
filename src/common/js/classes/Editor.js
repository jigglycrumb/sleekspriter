var Editor = function() {

  var self = this;

  this.version = '@@version';

  // init subclasses
  this.file.init();
  this.frames.init();
  this.layers.init();
  this.pixels.init();
  this.selection.init();
  this.paintBucket.init();
  // this.palettes.init();
  this.animations.init();
};

Editor.prototype = {};
Editor.prototype.constructor = Editor;