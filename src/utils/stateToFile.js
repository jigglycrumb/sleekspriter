// converts state JSON to *.pixels file format JSON
// TODO: add animations

const stateToFile = (state) => {
  let { frames, layers, pixels, size } = state;

  layers = layers.map(layerToFile);

  let mappedPixels = [];
  Object.keys(pixels).map(frame => {
    Object.keys(pixels[frame]).map(layer => {
      Object.keys(pixels[frame][layer]).map(x => {
        Object.keys(pixels[frame][layer][x]).map(y => {
          const { r, g, b, a } = pixels[frame][layer][x][y];
          mappedPixels.push([ layer, x, y, r, g, b, a ]);
        });
      });
    });
  });

  return {
    size: [size.width, size.height],
    frames: [frames.x, frames.y],
    layers,
    pixels: mappedPixels,
  };
};

const layerToFile = (layer) => [
  layer.id,
  layer.frame,
  layer.name,
  layer.z,
  layer.opacity,
  +layer.visible
];

export default stateToFile;
