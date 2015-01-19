// desktop file handlers
File.prototype.load = function(fullPath, callback) {

  console.info('File: '+fullPath);

  var fs = require('fs'),
      path = require('path');

  this.path = fullPath;
  this.name = path.basename(fullPath, '.pixels');
  this.folder = path.dirname(fullPath);

  fs.readFile(fullPath, function(error, contents) {
    if (error) throw error;
    callback(JSON.parse(contents));
  });
};

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