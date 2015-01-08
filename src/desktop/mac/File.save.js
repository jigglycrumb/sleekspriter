File.prototype.save = function(fullPath) {
  console.info('saving file', fullPath);

  var fullPath = fullPath || this.path,
      fs = require('fs'),
      p = require('path'),
      self = this;

  fs.writeFile(fullPath, this.toJSONString(), function(error) {
    if (error) throw error;
    self.path = fullPath;
    self.name = p.basename(fullPath, '.pixels');
    self.folder = p.dirname(fullPath);
  });
};