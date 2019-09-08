// converts JSON from file format to state-ready JSON
// TODO: add animations

const fileToState = file => {
  let { frames, layers, pixels, size } = file;

  layers = layers.map(layerToState);

  const frameDict = {};
  layers.forEach(layer => {
    frameDict[layer.id] = layer.frame;
  });

  const mappedPixels = {};
  pixels.forEach(p => {
    const pixel = {
      frame: frameDict[p[0]],
      layer: p[0],
      x: p[1],
      y: p[2],
      r: p[3],
      g: p[4],
      b: p[5],
      a: p[6],
    };

    if (!mappedPixels[pixel.frame]) mappedPixels[pixel.frame] = {};
    if (!mappedPixels[pixel.frame][pixel.layer])
      mappedPixels[pixel.frame][pixel.layer] = {};
    if (!mappedPixels[pixel.frame][pixel.layer][pixel.x])
      mappedPixels[pixel.frame][pixel.layer][pixel.x] = {};
    mappedPixels[pixel.frame][pixel.layer][pixel.x][pixel.y] = pixel;
  });

  return {
    frames: {
      x: frames[0],
      y: frames[1],
    },
    layers,
    pixels: mappedPixels,
    size: {
      width: size[0],
      height: size[1],
    },
  };
};

const layerToState = layer => ({
  id: layer[0],
  frame: layer[1],
  name: layer[2],
  z: layer[3],
  opacity: layer[4],
  visible: !!layer[5],
});

export default fileToState;
