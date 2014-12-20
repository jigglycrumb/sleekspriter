File.prototype.load = function(path, callback) {

  console.info('File: '+path);

  var url = 'loadfile.php?file=pixels/' + path;
  $.getJSON(url, callback);
};