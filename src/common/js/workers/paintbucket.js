// paintbucket worker

this.onmessage = function(e) {

  console.log('worker called');

  var newPixels = []; // the worker will return this

  var point = e.data.point,
      pixels = e.data.pixels,
      fillColor = e.data.fillColor,
      layer = e.data.layer,
      layerZ = e.data.layerZ,
      frame = e.data.frame,
      bounds = e.data.bounds

  // get the pixel the paint bucket was used on
  var initialPixel = getByPosition(pixels, point);

  // check if initial pixel already exists
  if(!initialPixel) {
    // pixel doesn't exist yet, create new transparent one
    initialPixel = {
      frame: frame,
      layer: layer,
      x: point.x,
      y: point.y,
      r: 0,
      g: 0,
      b: 0,
      a: 0
    };
  }

  // create color object from initial pixel
  var initialColor = {r: initialPixel.r, g: initialPixel.g, b: initialPixel.b, a: initialPixel.a};

  // array for already filled pixels
  var filled = [];


  // helper function to get neighbors of a pixel
  function getAdjacentPixels(point) {

    var p, // helper point
        arr = []; // array for found neighbors

    // get top neighbor
    p = {x: point.x, y: point.y-1};
    if(p.y >= bounds.top) arr.push(p);
    // get right neighbor
    p = {x: point.x+1, y: point.y};
    if(p.x <= bounds.right) arr.push(p);
    // get bottom neighbor
    p = {x: point.x, y: point.y+1};
    if(p.y <= bounds.bottom) arr.push(p);
    // get left neighbor
    p = {x: point.x-1, y: point.y};
    if(p.x >= bounds.left) arr.push(p);

    return arr;
  }

  // function to recursively fill the pixels
  function rFill(point) {

    // push pixel to filled array
    filled.push(point);

    var pixel = getByPosition(pixels, point),
        pixelColor,
        neighbors;

    if(!pixel) {
      pixelColor = {r: 0, g: 0, b: 0, a: 0};
    }
    else pixelColor = {r: pixel.r, g: pixel.g, b: pixel.b, a: pixel.a};

    if(colorIsSame(pixelColor, initialColor)) {

      newPixels.push({
        frame: frame,
        layer: layer,
        x: point.x,
        y: point.y,
        z: layerZ,
        r: fillColor.r,
        g: fillColor.g,
        b: fillColor.b,
        a: fillColor.a,
      });

      neighbors = getAdjacentPixels(point);
      neighbors.forEach(function(n) {
        var old = getByPosition(filled, {x: n.x, y: n.y});
        if(!old) rFill.call(this, n);
      }, this);
    }
  }

  // start recursively filling the pixels
  rFill.call(this, initialPixel);

  this.postMessage(newPixels);
}


// helper function to filter the pixels array for a specific positioned pixel
function getByPosition(array, position) {
  var filtered = array.filter(function(pixel) {
    return pixel.x == position.x && pixel.y == position.y
  });

  return filtered.length == 1 ? filtered[0] : false;
}

// helper function to compare two color objects
function colorIsSame(a, b) {
  return a.r == b.r && a.g == b.g && a.b == b.b && a.a == b.a
}