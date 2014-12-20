File.prototype.save = function(path) {
  console.log('saving file', path);

  path = path || this.path;

  var fs = require('fs');
  fs.writeFile(path, this.toJSONString(), function(error) {
    if (error) throw error;
    console.log('done');
  });
};