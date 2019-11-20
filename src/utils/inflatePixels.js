function inflatePixels(pixels) {
  const pixelMap = {};
  pixels.forEach(pixel => {
    if (!pixelMap[pixel.x]) pixelMap[pixel.x] = {};
    pixelMap[pixel.x][pixel.y] = pixel;
  });
  return pixelMap;
}

export default inflatePixels;
