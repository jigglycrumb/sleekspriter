// paintbucket worker

// helper function to filter the pixel map for a specific positioned pixel
function getByPosition(map, position) {
  if (!map[position.x]) return false;
  return map[position.x][position.y] || false;
}

function colorIsSame(a, b) {
  return a.r == b.r && a.g == b.g && a.b == b.b && a.a == b.a;
}

function hash(point) {
  return point.x + ":" + point.y;
}

// function to get neighbors of a pixel
function getAdjacentPixels(point, bounds) {
  let p, // helper point
    arr = []; // array for found neighbors

  // get top neighbor
  p = { x: point.x, y: point.y - 1 };
  if (p.y >= bounds.top) arr.push(p);
  // get right neighbor
  p = { x: point.x + 1, y: point.y };
  if (p.x <= bounds.right) arr.push(p);
  // get bottom neighbor
  p = { x: point.x, y: point.y + 1 };
  if (p.y <= bounds.bottom) arr.push(p);
  // get left neighbor
  p = { x: point.x - 1, y: point.y };
  if (p.x >= bounds.left) arr.push(p);

  return arr;
}

onmessage = function(e) {
  let newPixels = {}; // the worker will return this

  const { point, pixels, fillColor, layer, layerZ, frame, bounds } = e.data;

  // get the pixel the paint bucket was used on
  let initialPixel = getByPosition(pixels, point);

  // check if initial pixel already exists
  if (!initialPixel) {
    // pixel doesn't exist yet, create new transparent one
    initialPixel = {
      frame: frame,
      layer: layer,
      x: point.x,
      y: point.y,
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    };
  }

  // create color object from initial pixel
  const initialColor = {
    r: initialPixel.r,
    g: initialPixel.g,
    b: initialPixel.b,
    a: initialPixel.a,
  };

  let filled = {},
    currentGeneration = [initialPixel];

  while (currentGeneration.length > 0) {
    let nextGeneration = [],
      foundNeighbors = {};

    currentGeneration.forEach(function(point) {
      // push pixel to filled array
      filled[hash(point)] = true;

      let pixel = getByPosition(pixels, point),
        pixelColor,
        neighbors;

      if (!pixel) {
        pixelColor = { r: 0, g: 0, b: 0, a: 0 };
      } else pixelColor = { r: pixel.r, g: pixel.g, b: pixel.b, a: pixel.a };

      if (colorIsSame(pixelColor, initialColor)) {
        if (!newPixels[point.x]) newPixels[point.x] = {};
        newPixels[point.x][point.y] = {
          frame: frame,
          layer: layer,
          x: point.x,
          y: point.y,
          z: layerZ,
          r: fillColor.r,
          g: fillColor.g,
          b: fillColor.b,
          a: fillColor.a,
        };

        neighbors = getAdjacentPixels(point, bounds);

        neighbors.forEach(function(n) {
          if (!filled[hash(n)] && !foundNeighbors[hash(n)]) {
            nextGeneration.push(n);
            foundNeighbors[hash(n)] = true;
          }
        }, this);
      }
    }, this);

    currentGeneration = nextGeneration.slice(0);
  }

  // post back the new pixels
  postMessage(newPixels);
};
