File.load = function(file, callback) {

  console.info('File: '+file);

  var fs = require('fs');
  fs.readFile('pixels/'+file, 'utf-8', function(error, contents) {
    callback(JSON.parse(contents));
  });
};