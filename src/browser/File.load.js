File.load = function(file, callback) {

  console.info('File: '+file);

  var url = 'loadfile.php?file=pixels/' + file;
  $.getJSON(url, callback);
};