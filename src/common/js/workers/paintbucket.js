// paintbucket worker

// needs: flux, color, underscore

this.onmessage = function(e) {
  console.log('worker called');

  console.log(e.data.point);
  if(e.data.pixels.length > 0) console.log(e.data.pixels[0]);

  this.postMessage(e.data);
}

