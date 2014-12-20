File.prototype.load = function(path, callback) {

  console.info('File: '+path);

  this.path = path;

  var fs = require('fs');
  fs.readFile(path, function(error, contents) {
    if (error) throw error;
    callback(JSON.parse(contents));
  });
};