// converts state JSON to *.pixels file format JSON
// TODO: add animations

const stateToFile = state => {
  const { frames, layers, meta, pixels, size } = state;

  const mappedLayers = layers.map(layerToFile);
  const mappedPixels = [];

  Object.keys(pixels).map(frame => {
    Object.keys(pixels[frame]).map(layer => {
      Object.keys(pixels[frame][layer]).map(x => {
        Object.keys(pixels[frame][layer][x]).map(y => {
          const { r, g, b, a } = pixels[frame][layer][x][y];
          mappedPixels.push([+layer, +x, +y, r, g, b, +a]);
        });
      });
    });
  });

  return {
    meta,
    size: [size.width, size.height],
    frames: [frames.x, frames.y],
    layers: mappedLayers,
    pixels: mappedPixels,
  };
};

const layerToFile = layer => [
  layer.id,
  layer.frame,
  layer.name,
  layer.z,
  layer.opacity,
  +layer.visible,
];

export default stateToFile;
