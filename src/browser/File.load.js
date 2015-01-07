File.prototype.load = function(path, callback) {

  console.info('File: '+path);

  this.path = path;
  this.name = path.substr(0, path.lastIndexOf('.'));

  var url = 'loadfile.php?file=pixels/' + path;
  $.getJSON(url, callback);
};