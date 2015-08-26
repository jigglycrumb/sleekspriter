var Editor = function() {

  var self = this;

  this.version = '@@version';

  // init subclasses
  this.file.init();
  this.frames.init();
  this.pixels.init();
  this.paintBucket.init();
  // this.palettes.init();
};

Editor.prototype = {};
Editor.prototype.constructor = Editor;