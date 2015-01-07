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