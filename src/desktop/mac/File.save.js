File.prototype.save = function(path) {
  console.log('saving file', path);

  var fs = require('fs');
  fs.writeFile(path, this.toJSONString(), function(error) {
    if (error) throw error;
    console.log('done');
  });
};