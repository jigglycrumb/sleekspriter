File.load = function(file, callback) {

  console.info('File: '+file);

  var fs = require('fs');
  fs.readFile(file, function(error, contents) {
    if (error) throw error;
    callback(JSON.parse(contents));
  });
};